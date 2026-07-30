package br.edu.ifpr.fincontrol.backend.controller;

import org.springframework.web.bind.annotation.*;

import br.edu.ifpr.fincontrol.backend.dto.response.dashboard.DashboardResponse;
import br.edu.ifpr.fincontrol.backend.service.DashboardService;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/dashboard")
@RequiredArgsConstructor
@CrossOrigin
public class DashboardController {

    private final DashboardService service;

}