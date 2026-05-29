<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class UploadController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'image' => 'required|image|max:4096',
        ]);

        $path = $request->file('image')->store('posts', 'public');

        return response()->json([
            'url' => config('app.url') . '/storage/' . $path
        ]);
    }
}