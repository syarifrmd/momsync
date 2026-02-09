<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;

class HospitalApiService
{
    protected $baseUrl = 'https://use.api.co.id/hospitals/indonesia';
    protected $apiKey;

    public function __construct()
    {
        $this->apiKey = config('services.hospital_api.key');
    }

    public function getHospitals(array $params = [])
    {
        try {
            \Log::info('HospitalApiService - Calling external API', [
                'url' => $this->baseUrl,
                'params' => $params,
                'api_key' => substr($this->apiKey, 0, 10) . '...'
            ]);
            
            $response = Http::withHeaders([
                'x-api-co-id' => $this->apiKey,
            ])
            ->withOptions([
                'verify' => false, // Disable SSL verification for development
            ])
            ->get($this->baseUrl, $params);

            \Log::info('HospitalApiService - API Response', [
                'status' => $response->status(),
                'successful' => $response->successful(),
                'body_length' => strlen($response->body())
            ]);

            if ($response->successful()) {
                $data = $response->json();
                \Log::info('HospitalApiService - API Data', [
                    'is_success' => $data['is_success'] ?? null,
                    'data_count' => count($data['data'] ?? []),
                    'message' => $data['message'] ?? null
                ]);
                return $data;
            }

            \Log::error('HospitalApiService - API Failed', [
                'status' => $response->status(),
                'body' => $response->body()
            ]);
            
            return [
                'is_success' => false,
                'message' => 'Failed to fetch hospitals',
                'data' => [],
            ];
        } catch (\Exception $e) {
            \Log::error('HospitalApiService - Exception', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return [
                'is_success' => false,
                'message' => $e->getMessage(),
                'data' => [],
            ];
        }
    }

    public function searchByName(string $name, int $page = 1, int $size = 20)
    {
        return $this->getHospitals([
            'name' => $name,
            'page' => $page,
            'size' => $size,
        ]);
    }

    public function filterByProvince(string $provinceCode, int $page = 1, int $size = 20)
    {
        return $this->getHospitals([
            'province_code' => $provinceCode,
            'page' => $page,
            'size' => $size,
        ]);
    }

    public function filterByRegency(string $regencyCode, int $page = 1, int $size = 20)
    {
        return $this->getHospitals([
            'regency_code' => $regencyCode,
            'page' => $page,
            'size' => $size,
        ]);
    }

    public function filterByClass(string $class, int $page = 1, int $size = 20)
    {
        return $this->getHospitals([
            'class' => $class,
            'page' => $page,
            'size' => $size,
        ]);
    }

    /**
     * Get hospitals near user's location
     * This requires province/regency code based on coordinates
     */
    public function getNearby(string $provinceCode = null, string $regencyCode = null, int $page = 1, int $size = 20)
    {
        $params = [
            'page' => $page,
            'size' => $size,
        ];

        if ($regencyCode) {
            $params['regency_code'] = $regencyCode;
        } elseif ($provinceCode) {
            $params['province_code'] = $provinceCode;
        }

        return $this->getHospitals($params);
    }
}
