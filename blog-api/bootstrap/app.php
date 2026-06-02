<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Validation\ValidationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

CONST API_PATTERN = 'api/*';
return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )

    ->withMiddleware(function (Middleware $middleware): void {
        //
    })

    ->withExceptions(function (Exceptions $exceptions): void {

        /*
        |--------------------------------------------------------------------------
        | Authentication Exception
        |--------------------------------------------------------------------------
        */

        $exceptions->render(function (
            AuthenticationException $e,
            $request
        ) {

            if ($request->is(API_PATTERN)) {

                return response()->json([
                    'message' => 'No autenticado'
                ], 401);
            }
        });

        /*
        |--------------------------------------------------------------------------
        | Validation Exception
        |--------------------------------------------------------------------------
        */

        $exceptions->render(function (
            ValidationException $e,
            $request
        ) {

            if ($request->is(API_PATTERN)) {

                return response()->json([
                    'message' => 'Validation error',
                    'errors' => $e->errors()
                ], 422);
            }
        });

        /*
        |--------------------------------------------------------------------------
        | Model Not Found Exception
        |--------------------------------------------------------------------------
        */

        $exceptions->render(function (
            ModelNotFoundException $e,
            $request
        ) {

            if ($request->is(API_PATTERN)) {

                return response()->json([
                    'message' => 'Resource not found'
                ], 404);
            }
        });

        /*
        |--------------------------------------------------------------------------
        | Route Not Found Exception
        |--------------------------------------------------------------------------
        */

        $exceptions->render(function (
            NotFoundHttpException $e,
            $request
        ) {

            if ($request->is(API_PATTERN)) {

                return response()->json([
                    'message' => 'Endpoint not found'
                ], 404);
            }
        });

        /*
        |--------------------------------------------------------------------------
        | Generic Exception
        |--------------------------------------------------------------------------
        */

        $exceptions->render(function (
            Throwable $e,
            $request
        ) {

            if ($request->is(API_PATTERN)) {

                return response()->json([
                    'message' => 'No se pudo completar la solicitud'
                ], 500);
            }
        });
    })

    ->create();