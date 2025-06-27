# One Concept Today - Kubernetes Learning Platform 🎯

An interactive educational platform designed to help you master Kubernetes concepts through engaging flashcards with multiple choice questions and difficulty levels.

![Kubernetes Learning](https://img.shields.io/badge/Status-Active-brightgreen)
![Python](https://img.shields.io/badge/Python-3.8+-blue)
![Flask](https://img.shields.io/badge/Flask-2.3+-lightgrey)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow)

## 🌟 Features

- **Interactive Flashcards**: Learn through question-answer-explanation format
- **Difficulty Levels**: Basic, Intermediate, and Advanced questions to match your learning pace
- **Multiple Choice Questions**: Test your knowledge with interactive options
- **"Surprise Me" Functionality**: Get random questions to test your knowledge
- **Progressive Learning**: Reveal answers and detailed explanations step by step
- **Official Documentation Links**: Direct links to kubernetes.io for further learning
- **Responsive Design**: Works beautifully on desktop and mobile devices
- **Modern UI**: Clean, professional interface with smooth animations and gradients
- **Keyboard Shortcuts**: Navigate efficiently with keyboard commands

## 🚀 Quick Start

### Prerequisites

- Python 3.8 or higher
- pip (Python package installer)
- Modern web browser

### Installation

1. **Clone or download the project**
   ```bash
   cd oneconceptaday
   ```

2. **Set up the backend**
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

3. **Start the Flask server**
   ```bash
   python app.py
   ```
   The server will start on `http://localhost:5002`

4. **Open the frontend**
   - Open `frontend/index.html` in your web browser
   - Or serve it through a local server for better experience

### Alternative: Serve frontend through Flask

You can also serve the frontend through Flask by adding this to `app.py`:

```python
@app.route('/')
def serve_frontend():
    return send_from_directory('../frontend', 'index.html')

@app.route('/<path:path>')
def serve_static(path):
    return send_from_directory('../frontend', path)
```

## 📁 Project Structure

```
oneconceptaday/
├── backend/
│   ├── app.py              # Flask API server
│   └── requirements.txt    # Python dependencies
├── frontend/
│   ├── index.html          # Main HTML page
│   ├── styles.css          # CSS styling
│   └── script.js           # JavaScript functionality
├── data/
│   └── kubernetes.json     # Kubernetes flashcards with difficulty levels
├── venv/                   # Virtual environment
├── .github/
│   └── copilot-instructions.md
└── README.md
```

## 🎮 How to Use

1. **Start Learning**: Click on the Kubernetes card from the homepage
2. **Choose Difficulty**: Select Basic, Intermediate, or Advanced level
3. **Get a Question**: Click "Surprise Me" to receive a random question for your level
4. **Answer**: Select from multiple choice options or think about your answer
5. **Check Result**: See if your answer is correct with instant feedback
6. **Learn More**: Read the detailed explanation to deepen understanding
7. **Continue Learning**: Get new questions to reinforce learning

### Keyboard Shortcuts

- **Space/Enter**: Reveal answer or get new question
- **Escape**: Return to difficulty selection
- **R**: Reset current flashcard
- **1-3**: Select multiple choice options

## 🔧 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/topics` | GET | List all available topics |
| `/api/flashcard/<topic>/<difficulty>` | GET | Get random flashcard for topic and difficulty |
| `/api/flashcard/<topic>/all` | GET | Get all flashcards for topic |

### Example API Response

```json
{
  "topic": "kubernetes",
  "question": "What is a Kubernetes pod?",
  "answer": "A pod is the smallest deployable unit in Kubernetes...",
  "explanation": "Pods are typically used to group containers...",
  "options": [
    "A container runtime",
    "The smallest deployable unit",
    "A network policy"
  ],
  "correct_option_index": 1,
  "format": "multiple_choice",
  "reference_url": "https://kubernetes.io/docs/concepts/workloads/pods/"
}
```

## 📚 Adding New Topics

1. **Create a JSON file** in the `data/` directory (e.g., `docker.json`)
2. **Follow the format**:
   ```json
   [
     {
       "question": "Your question here",
       "answer": "The answer",
       "explanation": "Detailed explanation"
     }
   ]
   ```
3. **Add topic metadata** to `script.js`:
   - Icon in `topicIcons` object
   - Description in `topicDescriptions` object
4. **Restart the server** to see the new topic

## 🎨 Customization

### Styling
- Modify `frontend/styles.css` for visual changes
- Update CSS variables for color scheme
- Responsive breakpoints can be adjusted

### Functionality
- Edit `frontend/script.js` for behavior changes
- Modify `backend/app.py` for API enhancements
- Add new endpoints or features as needed

## 🚀 Deployment

### Local Development

For local development, follow the Quick Start instructions above.

### AWS EC2 Deployment (Production Ready)

Deploy this application on AWS EC2 for production use with high availability and performance.

#### Step 1: Launch EC2 Instance

1. **Create EC2 Instance**:
   - **AMI**: Amazon Linux 2 or Ubuntu 20.04 LTS
   - **Instance Type**: t2.micro (free tier) or t3.small for better performance
   - **Storage**: 20GB gp3 (sufficient for the application)

2. **Security Group Configuration**:
   ```
   Type            Protocol    Port Range    Source          Description
   SSH             TCP         22           Your IP          SSH access
   HTTP            TCP         80           0.0.0.0/0        Web traffic
   HTTPS           TCP         443          0.0.0.0/0        Secure web traffic
   Custom TCP      TCP         5002         0.0.0.0/0        API backend
   ```

3. **Create and download a key pair** for SSH access

#### Step 2: Connect to Your Instance

```bash
chmod 400 your-key.pem
ssh -i your-key.pem ec2-user@your-ec2-public-ip
```

#### Step 3: Install System Dependencies

**For Amazon Linux 2**:
```bash
# Update system
sudo yum update -y

# Install Python 3, pip, git, and nginx
sudo yum install -y python3 python3-pip git nginx

# Install development tools
sudo yum groupinstall -y "Development Tools"
```

**For Ubuntu 20.04**:
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Python 3, pip, git, and nginx
sudo apt install -y python3 python3-pip python3-venv git nginx

# Install development tools
sudo apt install -y build-essential
```

#### Step 4: Deploy the Application

1. **Clone the repository**:
   ```bash
   cd /home/ec2-user  # or /home/ubuntu for Ubuntu
   git clone https://github.com/your-username/oneconceptaday.git
   cd oneconceptaday
   ```

2. **Set up Python virtual environment**:
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   ```

3. **Install Python dependencies**:
   ```bash
   cd backend
   pip install -r requirements.txt
   pip install gunicorn  # Production WSGI server
   ```

4. **Test the backend**:
   ```bash
   python app.py
   ```
   Verify it starts on port 5002, then stop it (Ctrl+C).

#### Step 5: Configure Nginx for Frontend

1. **Copy frontend files**:
   ```bash
   sudo mkdir -p /var/www/oneconceptaday
   sudo cp -r /home/ec2-user/oneconceptaday/frontend/* /var/www/oneconceptaday/
   ```

2. **Update API URL for production**:
   ```bash
   sudo nano /var/www/oneconceptaday/script.js
   ```
   Change the API_BASE_URL:
   ```javascript
   const API_BASE_URL = 'http://YOUR-EC2-PUBLIC-IP:5002/api';
   // Or if using domain: const API_BASE_URL = 'https://yourdomain.com/api';
   ```

3. **Create Nginx configuration**:
   ```bash
   sudo nano /etc/nginx/conf.d/oneconceptaday.conf
   ```
   
   Add this configuration:
   ```nginx
   server {
       listen 80;
       server_name your-domain.com www.your-domain.com;  # Replace with your domain or EC2 IP
       
       root /var/www/oneconceptaday;
       index index.html;
       
       # Serve static files
       location / {
           try_files $uri $uri/ =404;
           
           # Cache static assets
           location ~* \.(css|js|png|jpg|jpeg|gif|ico|svg)$ {
               expires 1y;
               add_header Cache-Control "public, immutable";
           }
       }
       
       # Proxy API requests to Flask backend
       location /api/ {
           proxy_pass http://localhost:5002;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
           
           # Enable CORS
           add_header Access-Control-Allow-Origin *;
           add_header Access-Control-Allow-Methods "GET, POST, OPTIONS";
           add_header Access-Control-Allow-Headers "Origin, X-Requested-With, Content-Type, Accept";
       }
       
       # Security headers
       add_header X-Frame-Options "SAMEORIGIN" always;
       add_header X-XSS-Protection "1; mode=block" always;
       add_header X-Content-Type-Options "nosniff" always;
   }
   ```

4. **Test and reload Nginx**:
   ```bash
   sudo nginx -t
   sudo systemctl start nginx
   sudo systemctl enable nginx
   ```

#### Step 6: Set up Backend as a System Service

1. **Create systemd service file**:
   ```bash
   sudo nano /etc/systemd/system/oneconceptaday.service
   ```

2. **Add service configuration**:
   ```ini
   [Unit]
   Description=One Concept Today - Kubernetes Learning Platform
   After=network.target
   
   [Service]
   Type=simple
   User=ec2-user
   WorkingDirectory=/home/ec2-user/oneconceptaday/backend
   Environment=PATH=/home/ec2-user/oneconceptaday/venv/bin
   Environment=FLASK_ENV=production
   ExecStart=/home/ec2-user/oneconceptaday/venv/bin/gunicorn -w 4 -b 127.0.0.1:5002 app:app
   Restart=always
   RestartSec=10
   
   [Install]
   WantedBy=multi-user.target
   ```

3. **Start and enable the service**:
   ```bash
   sudo systemctl daemon-reload
   sudo systemctl start oneconceptaday
   sudo systemctl enable oneconceptaday
   sudo systemctl status oneconceptaday
   ```

#### Step 7: Configure Domain and SSL (Optional but Recommended)

1. **Point your domain to EC2**:
   - Create an A record pointing to your EC2 public IP
   - Update Nginx configuration with your domain name

2. **Install SSL certificate with Let's Encrypt**:
   ```bash
   # Install certbot
   sudo yum install -y certbot python3-certbot-nginx  # Amazon Linux
   # OR
   sudo apt install -y certbot python3-certbot-nginx  # Ubuntu
   
   # Get SSL certificate
   sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
   
   # Set up auto-renewal
   sudo crontab -e
   # Add this line:
   0 12 * * * /usr/bin/certbot renew --quiet
   ```

#### Step 8: Monitoring and Maintenance

1. **Check application logs**:
   ```bash
   # Backend logs
   sudo journalctl -u oneconceptaday -f
   
   # Nginx logs
   sudo tail -f /var/log/nginx/access.log
   sudo tail -f /var/log/nginx/error.log
   ```

2. **Monitor system resources**:
   ```bash
   # Install htop for system monitoring
   sudo yum install -y htop  # Amazon Linux
   sudo apt install -y htop  # Ubuntu
   
   htop
   ```

3. **Set up log rotation** (optional):
   ```bash
   sudo nano /etc/logrotate.d/oneconceptaday
   ```
   ```
   /var/log/oneconceptaday/*.log {
       daily
       missingok
       rotate 52
       compress
       delaycompress
       notifempty
   }
   ```

#### Step 9: Security Hardening

1. **Update firewall rules**:
   ```bash
   # Install and configure firewall (Ubuntu)
   sudo ufw allow ssh
   sudo ufw allow 'Nginx Full'
   sudo ufw enable
   ```

2. **Regular security updates**:
   ```bash
   # Set up automatic security updates (Ubuntu)
   sudo apt install -y unattended-upgrades
   sudo dpkg-reconfigure unattended-upgrades
   ```

#### Step 10: Backup Strategy

1. **Create backup script**:
   ```bash
   nano ~/backup.sh
   ```
   ```bash
   #!/bin/bash
   DATE=$(date +%Y%m%d_%H%M%S)
   tar -czf /home/ec2-user/backup_$DATE.tar.gz /home/ec2-user/oneconceptaday/data/
   aws s3 cp /home/ec2-user/backup_$DATE.tar.gz s3://your-backup-bucket/
   find /home/ec2-user/backup_*.tar.gz -mtime +7 -delete
   ```

2. **Schedule backups**:
   ```bash
   chmod +x ~/backup.sh
   crontab -e
   # Add: 0 2 * * * /home/ec2-user/backup.sh
   ```

### Alternative Deployment Options

#### Docker Deployment
```bash
# Build and run with Docker
docker build -t oneconceptaday .
docker run -p 80:80 -p 5002:5002 oneconceptaday
```

#### Kubernetes Deployment
```yaml
# Deploy to Kubernetes cluster
kubectl apply -f k8s/deployment.yaml
```

### For Production (Traditional Setup)

1. **Install Gunicorn**:
   ```bash
   pip install gunicorn
   ```

2. **Run with Gunicorn**:
   ```bash
   gunicorn -w 4 -b 0.0.0.0:5002 app:app
   ```

3. **Configure NGINX** as reverse proxy:
   ```nginx
   server {
       listen 80;
       server_name oneconcepttoday.online;
       
       location / {
           proxy_pass http://localhost:5002;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
       }
   }
   ```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Add your changes
4. Test thoroughly
5. Submit a pull request

### Ideas for Contributions

- [ ] Add more technology topics (Docker, Python, React, etc.)
- [ ] Implement user progress tracking
- [ ] Add difficulty levels for questions
- [ ] Create admin interface for content management
- [ ] Add search functionality
- [ ] Implement spaced repetition algorithm
- [ ] Add dark mode toggle
- [ ] Create mobile app version

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🐛 Troubleshooting

### Common Issues

**Backend not starting:**
- Check Python version (3.8+ required)
- Install dependencies: `pip install -r requirements.txt`
- Verify port 5002 is available

**Frontend not loading topics:**
- Ensure backend is running on port 5002
- Check browser console for error messages
- Verify CORS is enabled in Flask app

**No flashcards appearing:**
- Check that kubernetes.json exists in `data/` directory
- Validate JSON format in data files
- Ensure the backend API is accessible at `/api/topics`

## 📞 Support

For questions or support:
- Create an issue in the repository
- Check existing documentation
- Review the troubleshooting section

---

**Happy Learning!** 🎓 Master one concept every day with One Concept Today!
