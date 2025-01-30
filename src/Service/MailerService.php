<?php 

namespace App\Service;

use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Email;
use Twig\Environment;

class MailerService
{
    private MailerInterface $mailer;
    private Environment $twig;

    public function __construct(MailerInterface $mailer, Environment $twig)
    {
        $this->mailer = $mailer;
        $this->twig = $twig;
    }

    public function sendAccountCreationEmail(string $email, string $password)
    {
        $htmlContent = $this->twig->render('emails/account_creation.html.twig', [
            'email' => $email,
            'password' => $password,
        ]);
        $email = (new Email())
        ->from('carl.richard@institutsolacroup.com')
        ->replyTo('carl.richard@institutsolacroup.com')
        ->to($email)
        ->subject('Votre compte a été créé sur MyMood')
        ->html($htmlContent);
    

        $this->mailer->send($email);
    }
}
