package br.edu.ifpr.fincontrol.backend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;
    private final TemplateEngine templateEngine;

    @Value("${app.mail.enabled:true}")
    private boolean mailEnabled;

    @Value("${app.mail.from}")
    private String fromEmail;

    public void sendPasswordResetEmail(
            String to,
            String name,
            String resetLink) {

        if (!mailEnabled) {
            throw new ResponseStatusException(
                    HttpStatus.SERVICE_UNAVAILABLE,
                    "A recuperação de senha por e-mail está indisponível nesta implantação.");
        }

        Context context = new Context();
        context.setVariable("userName", name);
        context.setVariable("resetLink", resetLink);

        sendEmail(
                to,
                "Recuperação de Senha - FinControl",
                "mail/reset-password",
                context);
    }

    public void sendWelcomeEmail(String to, String name) {
        Context context = new Context();
        context.setVariable("userName", name);

        sendEmailWithoutInterruptingOperation(
                to,
                "Bem-vindo ao FinControl!",
                "mail/welcome",
                context);
    }

    public void sendWalletMemberAddedEmail(
            String to,
            String memberName,
            String ownerName,
            String walletName,
            String role) {

        Context context = new Context();
        context.setVariable("userName", memberName);
        context.setVariable("ownerName", ownerName);
        context.setVariable("walletName", walletName);
        context.setVariable("role", role);

        sendEmailWithoutInterruptingOperation(
                to,
                "Você foi adicionado a uma carteira compartilhada - FinControl",
                "mail/wallet-member-added",
                context);
    }

    private void sendEmailWithoutInterruptingOperation(
            String to,
            String subject,
            String template,
            Context context) {

        if (!mailEnabled) {
            log.info(
                    "Envio do e-mail '{}' desativado neste ambiente.",
                    subject);
            return;
        }

        try {
            sendEmail(to, subject, template, context);
        } catch (RuntimeException exception) {

            log.error(
                    "Não foi possível enviar o e-mail '{}'.",
                    subject,
                    exception);
        }
    }

    private void sendEmail(
            String to,
            String subject,
            String template,
            Context context) {

        try {
            String html = templateEngine.process(template, context);

            MimeMessage mimeMessage = mailSender.createMimeMessage();

            MimeMessageHelper helper = new MimeMessageHelper(
                    mimeMessage,
                    true,
                    "UTF-8");

            helper.setSubject(subject);
            helper.setTo(to);
            helper.setFrom(fromEmail, "FinControl");
            helper.setText(html, true);

            mailSender.send(mimeMessage);

        } catch (Exception exception) {
            log.error(
                    "Erro ao enviar o e-mail '{}'.",
                    subject,
                    exception);

            throw new RuntimeException(
                    "Não foi possível enviar o e-mail.",
                    exception);
        }
    }
}