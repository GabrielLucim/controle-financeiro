package br.edu.ifpr.fincontrol.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.edu.ifpr.fincontrol.backend.dto.response.dashboard.DashboardResponse;
import br.edu.ifpr.fincontrol.backend.service.DashboardService;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping
    public ResponseEntity<DashboardResponse> getDashboard() {

        System.out.println("CHEGOU NO DASHBOARD");

        return ResponseEntity.ok(
                dashboardService.getDashboard());

    }

}