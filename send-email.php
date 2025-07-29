<?php
// Prevent direct access
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    exit('Method not allowed');
}

// Set content type
header('Content-Type: application/json');

// Initialize response array
$response = ['success' => false, 'message' => ''];

try {
    // Validate and sanitize input
    $name = filter_input(INPUT_POST, 'name', FILTER_SANITIZE_STRING);
    $email = filter_input(INPUT_POST, 'email', FILTER_SANITIZE_EMAIL);
    $phone = filter_input(INPUT_POST, 'phone', FILTER_SANITIZE_STRING);
    $message = filter_input(INPUT_POST, 'message', FILTER_SANITIZE_STRING);
    $captcha_answer = filter_input(INPUT_POST, 'captcha_answer', FILTER_SANITIZE_STRING);
    $captcha_question = filter_input(INPUT_POST, 'captcha_question', FILTER_SANITIZE_STRING);
    
    // Check for honeypot field (should be empty)
    $honeypot = filter_input(INPUT_POST, 'honeypot', FILTER_SANITIZE_STRING);
    if (!empty($honeypot)) {
        throw new Exception('Invalid submission');
    }
    
    // Validate required fields
    if (empty($name) || empty($email) || empty($message)) {
        throw new Exception('Please fill in all required fields');
    }
    
    // Validate email format
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        throw new Exception('Please enter a valid email address');
    }
    
    // Validate captcha (basic validation - in production, use a more robust solution)
    if (empty($captcha_answer)) {
        throw new Exception('Please complete the security check');
    }
    
    // Prepare email content
    $to = 'info@shades.ca'; // Replace with actual email
    $subject = 'New Contact Form Submission - shades';
    
    $email_content = "New contact form submission:\n\n";
    $email_content .= "Name: " . $name . "\n";
    $email_content .= "Email: " . $email . "\n";
    $email_content .= "Phone: " . ($phone ?: 'Not provided') . "\n";
    $email_content .= "Message:\n" . $message . "\n\n";
    $email_content .= "Submitted on: " . date('Y-m-d H:i:s') . "\n";
    $email_content .= "IP Address: " . $_SERVER['REMOTE_ADDR'] . "\n";
    
    // Email headers
    $headers = [
        'From: ' . $email,
        'Reply-To: ' . $email,
        'X-Mailer: PHP/' . phpversion(),
        'Content-Type: text/plain; charset=UTF-8'
    ];
    
    // Send email
    $mail_sent = mail($to, $subject, $email_content, implode("\r\n", $headers));
    
    if (!$mail_sent) {
        throw new Exception('Failed to send email. Please try again later.');
    }
    
    // Success response
    $response['success'] = true;
    $response['message'] = 'Thank you for your message! We will get back to you soon.';
    
} catch (Exception $e) {
    $response['message'] = $e->getMessage();
}

// Return JSON response
echo json_encode($response);
exit;
?>