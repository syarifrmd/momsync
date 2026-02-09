<?php

namespace App\Http\Controllers;

use App\Services\HospitalApiService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CareLocatorController extends Controller
{
    protected $hospitalService;

    public function __construct(HospitalApiService $hospitalService)
    {
        $this->hospitalService = $hospitalService;
    }

    public function index()
    {
        return Inertia::render('care-locator');
    }

    public function search(Request $request)
    {
        \Log::info('CareLocator Search called', ['params' => $request->all()]);
        
        $validated = $request->validate([
            'name' => 'nullable|string',
            'province_code' => 'nullable|string',
            'regency_code' => 'nullable|string',
            'class' => 'nullable|string',
            'page' => 'nullable|integer|min:1',
            'size' => 'nullable|integer|min:1|max:100',
        ]);

        $params = array_filter([
            'name' => $validated['name'] ?? null,
            'province_code' => $validated['province_code'] ?? null,
            'regency_code' => $validated['regency_code'] ?? null,
            'class' => $validated['class'] ?? null,
            'page' => $validated['page'] ?? 1,
            'size' => $validated['size'] ?? 20,
        ]);

        \Log::info('CareLocator Filtered params', ['params' => $params]);
        
        $result = $this->hospitalService->getHospitals($params);
        
        \Log::info('CareLocator API Result', [
            'is_success' => $result['is_success'] ?? false,
            'count' => count($result['data'] ?? []),
            'message' => $result['message'] ?? null
        ]);

        return response()->json($result);
    }

    public function nearby(Request $request)
    {
        $validated = $request->validate([
            'province_code' => 'nullable|string',
            'regency_code' => 'nullable|string',
            'page' => 'nullable|integer|min:1',
            'size' => 'nullable|integer|min:1|max:100',
        ]);

        $result = $this->hospitalService->getNearby(
            $validated['province_code'] ?? null,
            $validated['regency_code'] ?? null,
            $validated['page'] ?? 1,
            $validated['size'] ?? 20
        );

        return response()->json($result);
    }
}
