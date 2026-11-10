
package br.edu.ifpr.fincontrol.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import br.edu.ifpr.fincontrol.backend.dto.response.report.MonthlyReportResponse;
import br.edu.ifpr.fincontrol.backend.security.UserDetailsImpl;
import br.edu.ifpr.fincontrol.backend.service.ReportService;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Positive;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/reports")
@RequiredArgsConstructor
public class ReportController {

    private final ReportService reportService;

    @GetMapping("/monthly")
    public ResponseEntity<MonthlyReportResponse> getMonthlyReport(
            @RequestParam @Positive Long walletId,
            @RequestParam @Min(1) @Max(9999) Integer year,
            @RequestParam @Min(1) @Max(12) Integer month,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {

        MonthlyReportResponse report = reportService.getMonthlyReport(
                walletId,
                year,
                month,
                userDetails.getUser().getId());

        return ResponseEntity.ok(report);
    }
}
