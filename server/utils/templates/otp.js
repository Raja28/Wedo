exports.orderEmail = (name, otp) => {
    return `<!DOCTYPE html>
    <html>
    
    <head>
        <meta charset="UTF-8">
        <title>Payment Confirmation mail</title>
        <style>
            body {
                background-color: #ffffff;
                font-family: Arial, sans-serif;
                font-size: 16px;
                line-height: 1.4;
                color: #333333;
                margin: 0;
                padding: 0;
            }
    
    
            .container {
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                text-align: center;
            }
    
            .logo {
                max-width: 200px;
                margin-bottom: 20px;
            }
    
            .message {
                font-size: 18px;
                font-weight: bold;
                margin-bottom: 20px;
            }
    
            .body {
                font-size: 16px;
                margin-bottom: 20px;
            }
    
            .cta {
                display: inline-block;
                padding: 10px 20px;
                background-color: #FFD60A;
                color: #000000;
                text-decoration: none;
                border-radius: 5px;
                font-size: 16px;
                font-weight: bold;
                margin-top: 20px;
            }
    
            .support {
                font-size: 14px;
                color: #999999;
                margin-top: 20px;
            }
    
            .highlight {
                font-weight: bold;
            }
        </style>
    
    </head>
    
    <body>
        <div class="container">
            <a href="https://res.cloudinary.com/dooxbo8sg/image/upload/v1720036696/MP-1-NeoG/MP-Logo_lwscnz.png"><img class="logo" src="https://res.cloudinary.com/dooxbo8sg/image/upload/v1720036696/MP-1-NeoG/MP-Logo_lwscnz.png"
                    alt="ModernMobiles Logo"></a>
            <div class="message">Verification Mail</div>
            <div class="body">
                <p>Dear ${name},</p>
                <p>Your signup OTP is : !</p>
                <p>OTP: <span class="highlight">"${otp}"</span>
                <p>The OTP is valid for 5 minutes.</p>
            </div>
        </div>
    </body>
    
    </html>`;
};