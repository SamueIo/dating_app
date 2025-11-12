<?php

namespace App\Http\Controllers;

use Illuminate\Database\Eloquent\Casts\Json;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use App\Models\Photos;
use Illuminate\Support\Facades\Storage;
use Mockery\Undefined;
use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver;

/*
    Handles user photo management including upload, deletion, setting main photo,
    and editing descriptions.

*/
class PhotoController extends Controller
{

    /*
        List all photos of the authenticated user.

        Adds full URL to each photo and ensures HTTPS protocol.
        @return Response JSON
    */
    public function index()
    {
        $photos = Auth::user()->photos;

        if($photos->isEmpty()){
            return response()->json(['message' => 'No photos for this user']);
        }

        $photos->map(function($photo) {
            $photo->url = asset('/storage/' . $photo->file_name);

            if (str_starts_with($photo->url, 'http://')) {
                $photo->url = str_replace('http://', 'https://', $photo->url);
            }

            return $photo;
        });
        return response()->json($photos);
    }

    /*
        Upload one or multiple photos for the authenticated user.

        - Resizes images to max width of 1200px, converts to WebP with 70% quality.
        - Handles `is_main` logic for main photo selection.
        - Stores photo description if provided.

        @param Request $request
        @return Response JSON
     */
    public function store(Request $request)
    {
        $request->validate([
            'photos.*' => 'required|image|max:3072',
            'description.*' => 'nullable|string|max:255',
            'is_main.*' => 'nullable|boolean',
        ]);

        $user = Auth::user();
        $hasExistingPhotos = $user->photos()->exists();
        $manager = new ImageManager(new Driver());

        $anyMainSelected = collect($request->input('is_main', []))
            ->contains(fn($value) => filter_var($value, FILTER_VALIDATE_BOOLEAN));

        $photos = [];
        $firstPhoto = true;

        foreach ($request->file('photos') as $index => $photoFile) {
            $image = $manager->read($photoFile);
            $width = 1200;
            $height = intval($image->height() * ($width / $image->width()));
            $image->resize($width, $height);
            $encoded = $image->encodeByExtension('webp', quality: 70);

            $fileName = uniqid('photo_') . '.webp';
            $path = 'photos/' . $fileName;
            Storage::disk('public')->put($path, (string) $encoded);

            // ===is_main ===
            $isMain = filter_var($request->input("is_main.$index", false), FILTER_VALIDATE_BOOLEAN);

            if (!$anyMainSelected && $firstPhoto) {
                $isMain = true;
            }

            if ($isMain){
                $user->photos()->where('is_main', 1)->update(['is_main' => 0]);
            }

            $description = $request->input("description.$index", null);

            $photoRecord = $user->photos()->create([
                'file_name' => $path,
                'description' => $description,
                'is_main' => $isMain,
            ]);

            $photos[] = $photoRecord;
            $firstPhoto = false;
        }


        return response()->json([
            'message' => 'Photos uploaded successfully',
            'photos' => $photos,
        ], 201);
    }

    /*
        Set a photo as the main photo for the authenticated user.

        @param int $id
        @return JSON
    */
    public function setMain($id)
    {
        $user = auth()->user();

        $user->photos()->update(['is_main' => 0]);
        $photo = $user->photos()->findOrFail($id);
        $photo->update(['is_main' => 1]);

        return response()->json(['message' => 'Photo set as main']);
    }


    /*
        Delete a photo for the authenticated user.

        If the deleted photo was main, selects a new main photo randomly.

        @param int $id
        @return JSON response
     */
    public function destroy($id)
    {
        $user = auth()->user();

        $photo = $user->photos()->findOrFail($id);
        $wasMain = $photo->is_main;

        if($photo->url){
            $relativePath = str_replace('storage/','', $photo->url);
            Storage::disk('public')->delete($relativePath);
        }
        $photo->delete();

        if ($wasMain) {
        $newMainPhoto = $user->photos()->inRandomOrder()->first();
        if ($newMainPhoto) {
            $newMainPhoto->is_main = 1;
            $newMainPhoto->save();
        }
    }

        return response()->json(['message' => 'Photo deletes']) ;

    }

    /*
        Edit description of a user's photo.

        @param Request $request
        @param int $id
        @return JsonResponse
    */
    public function editDescription( Request $request, $id )
    {
        $request->validate([
            'description' => 'nullable|string|max:255',
        ]);
        $user = auth()->user();

        $photo = $user->photos()->findOrFail($id);
        $photo->description = $request->description;

        $photo->save();

        return response()->json(['message' => 'Description updated']);
    }
}
