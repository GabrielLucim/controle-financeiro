package br.edu.ifpr.fincontrol.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.edu.ifpr.fincontrol.backend.dto.request.ai.FinancialAnalysisRequest;
import br.edu.ifpr.fincontrol.backend.dto.response.ai.FinancialAnalysisResponse;
import br.edu.ifpr.fincontrol.backend.security.UserDetailsImpl;
import br.edu.ifpr.fincontrol.backend.service.AiAnalysisService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/ai")
@RequiredArgsConstructor
public class AiController {

    private final AiAnalysisService aiAnalysisService;

    @PostMapping("/financial-analysis")
    public ResponseEntity<FinancialAnalysisResponse> analyzeFinancialData(
            @RequestBody @Valid FinancialAnalysisRequest request,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {

        FinancialAnalysisResponse response = aiAnalysisService.analyze(
                request,
                userDetails.getUser().getId());

        return ResponseEntity.ok(response);
    }
}
