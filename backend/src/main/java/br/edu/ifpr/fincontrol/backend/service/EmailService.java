
package br.edu.ifpr.fincontrol.backend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
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

    @Value("${spring.mail.username}")
    private String fromEmail;

    public void sendPasswordResetEmail(
            String to,
            String name,
            String resetLink) {

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

        try {
            sendEmail(to, subject, template, context);
        } catch (RuntimeException exception) {

            log.error(
                    "Não foi possível enviar o e-mail '{}' para {}",
                    subject,
                    to,
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
                    "Erro ao enviar o e-mail '{}' para {}",
                    subject,
                    to,
                    exception);

            throw new RuntimeException(
                    "Não foi possível enviar o e-mail.",
                    exception);
        }
    }
}
