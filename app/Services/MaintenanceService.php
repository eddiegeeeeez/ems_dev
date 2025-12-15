<?php

namespace App\Services;

use App\Models\MaintenanceRequest;
use App\Models\Notification;
use App\Models\User;

class MaintenanceService
{
    /**
     * Create maintenance request
     */
    public function createRequest(array $data): MaintenanceRequest
    {
        $request = MaintenanceRequest::create($data);

        // Notify assigned technician if assigned
        if ($data['assigned_to'] ?? null) {
            $this->notifyTechnician($request);
        }

        return $request;
    }

    /**
     * Assign request to technician
     */
    public function assignRequest(MaintenanceRequest $request, int $userId): MaintenanceRequest
    {
        $request->update(['assigned_to' => $userId]);
        $this->notifyTechnician($request);

        return $request;
    }

    /**
     * Update request status
     */
    public function updateStatus(MaintenanceRequest $request, string $status, ?string $notes = null): MaintenanceRequest
    {
        $request->update([
            'status' => $status,
            'notes' => $notes,
        ]);

        // Notify admins of status change
        $this->notifyAdmins("Maintenance request updated to {$status}", $request);

        return $request;
    }

    /**
     * Get open requests
     */
    public function getOpenRequests()
    {
        return MaintenanceRequest::open()
            ->with('venue', 'equipment', 'assignedUser')
            ->orderBy('priority', 'desc')
            ->orderBy('created_at', 'asc')
            ->get();
    }

    /**
     * Get requests by priority
     */
    public function getRequestsByPriority(string $priority)
    {
        return MaintenanceRequest::priority($priority)
            ->with('venue', 'equipment')
            ->get();
    }

    /**
     * Get technician's assigned requests
     */
    public function getTechnicianRequests(int $userId)
    {
        return MaintenanceRequest::where('assigned_to', $userId)
            ->open()
            ->with('venue', 'equipment')
            ->orderBy('priority', 'desc')
            ->get();
    }

    /**
     * Notify technician
     */
    private function notifyTechnician(MaintenanceRequest $request): void
    {
        if (!$request->assigned_to) return;

        $technician = User::find($request->assigned_to);
        if (!$technician) return;

        Notification::create([
            'type' => 'maintenance_assigned',
            'notifiable_type' => User::class,
            'notifiable_id' => $technician->id,
            'data' => [
                'message' => "New maintenance request: {$request->title}",
                'request_id' => $request->id,
            ],
        ]);
    }

    /**
     * Notify admins
     */
    private function notifyAdmins(string $message, MaintenanceRequest $request): void
    {
        $admins = User::where('role', 'ADMIN')->get();

        foreach ($admins as $admin) {
            Notification::create([
                'type' => 'maintenance_updated',
                'notifiable_type' => User::class,
                'notifiable_id' => $admin->id,
                'data' => [
                    'message' => $message,
                    'request_id' => $request->id,
                ],
            ]);
        }
    }
}
