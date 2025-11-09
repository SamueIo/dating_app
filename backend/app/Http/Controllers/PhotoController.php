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
use Illuminate\Support\Facades\Log;
class PhotoController extends Controller
{
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

    public function store(Request $request)
    {
        $request->validate([
        'photos.*' => 'required|image|max:51200', // 5MB max
        'description' => 'nullable|string|max:255',
        'is_main' => 'nullable|boolean',
        ]);

        $user = Auth::user();

        $currentMain = $request->is_main;
        if ($request->is_main == 0 && !$user->photos()->exists()) {
            $currentMain = 1;
        }

        if ($currentMain == 1) {
            $user->photos()->update(['is_main' => 0]);
        }

        $manager = new ImageManager(new Driver());

        $photos = [];

        foreach ($request->file('photos') as $photoFile) {
            // image load

            $image = $manager->read($photoFile);

            $width = 1200;
            $height = intval($image->height() * ($width / $image->width()));

            $image->resize($width, $height);

            // compresion and webp
            $encoded = $image->encodeByExtension('webp', quality: 70);

            // name and storage
            $fileName = uniqid('photo_') . '.webp';
            $path = 'photos/' . $fileName;
            Storage::disk('public')->put($path, (string) $encoded);

            // db write
            $photoRecord = $user->photos()->create([
                'file_name' => $path,
                'description' => $request->description,
                'is_main' => $currentMain,
            ]);

            $photos[] = $photoRecord;
        }

        return response()->json([
            'message' => 'Photos uploaded successfully',
            'photos' => $photos,
        ], 201);
}
    public function setMain($id)
    {
        $user = auth()->user();

        $user->photos()->update(['is_main' => 0]);
        $photo = $user->photos()->findOrFail($id);
        $photo->update(['is_main' => 1]);

        return response()->json(['message' => 'Photo set as main']);
    }

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
