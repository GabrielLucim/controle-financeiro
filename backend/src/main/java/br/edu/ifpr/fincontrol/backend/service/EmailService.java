package br.edu.ifpr.fincontrol.backend.service;

import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;
    private final TemplateEngine templateEngine;

    public void sendPasswordResetEmail(String to, String name, String resetLink) {
        
        try {
            Context context = new Context();
            context.setVariable("userName", name);
            context.setVariable("resetLink", resetLink);

            String process = templateEngine.process("mail/reset-password", context);

            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");

            helper.setSubject("Recuperação de Senha - FinControl");
            helper.setTo(to);
            helper.setFrom("20241pvai10030005@estudantes.ifpr.edu.br");
            helper.setText(process, true);

            mailSender.send(mimeMessage);

            System.out.println("Email enviado!");
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException(e);
        }
    }
}