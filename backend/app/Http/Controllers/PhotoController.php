<?php

namespace App\Http\Controllers;

use Illuminate\Database\Eloquent\Casts\Json;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use App\Models\Photos;
use Illuminate\Support\Facades\Storage;
use Mockery\Undefined;

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
            return $photo;
        });
        return response()->json($photos);
    }

    public function store(Request $request)
{
    // \Log::info($request->all());
    $request->validate([
        'photos.*' => 'required|image|max:2048',
        'description' => 'nullable|string|max:255',
        'is_main' => 'nullable|boolean',
    ]);

    $user = Auth::user();
    $isMain = null;



    $mainPhoto = Auth::user()->photos()->where('is_main', true)->first();

    $currentMain = $request->is_main;
    if($request->is_main == 0 && !Auth::user()->photos()->exists()){
        $currentMain = 1;
    }else{
        $currentMain = $request->is_main;
    }

    if ($currentMain == 1) {
        $user->photos()->update(['is_main' => 0]);
    }

    $photos = [];

    $photosFiles = $request->file('photos');


    foreach ($request->file('photos') as $photo) {
        $path = $photo->store('photos', 'public');

        $photoRecord = $user->photos()->create([
            'file_name' => $path,
            'description' => $request->description,
            'is_main' => $currentMain,
        ]);

        $photos[] = $photoRecord;

    }



    return response()->json([
        'message' => 'Photos uploaded successfully',
        'photos' => $photos
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
