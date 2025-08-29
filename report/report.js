// Global variables
let currentStep = 1;
let formData = {};
let uploadedFiles = [];
let captchaText = '';

// State to city mapping
const stateCityData = {
    'andhra-pradesh': ['Visakhapatnam', 'Vijayawada', 'Guntur', 'Tirupati', 'Kakinada'],
    'arunachal-pradesh': ['Itanagar', 'Naharlagun', 'Pasighat', 'Tezpur', 'Bomdila'],
    'assam': ['Guwahati', 'Silchar', 'Dibrugarh', 'Jorhat', 'Nagaon'],
    'bihar': ['Patna', 'Gaya', 'Bhagalpur', 'Muzaffarpur', 'Darbhanga'],
    'chhattisgarh': ['Raipur', 'Bhilai', 'Bilaspur', 'Korba', 'Durg'],
    'goa': ['Panaji', 'Vasco da Gama', 'Margao', 'Mapusa', 'Ponda'],
    'gujarat': ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Gandhinagar'],
    'haryana': ['Gurugram', 'Faridabad', 'Panipat', 'Ambala', 'Karnal'],
    'himachal-pradesh': ['Shimla', 'Dharamshala', 'Solan', 'Mandi', 'Kullu'],
    'jharkhand': ['Ranchi', 'Jamshedpur', 'Dhanbad', 'Bokaro', 'Deoghar'],
    'karnataka': ['Bengaluru', 'Mysuru', 'Mangaluru', 'Hubli', 'Belagavi'],
    'kerala': ['Thiruvananthapuram', 'Kochi', 'Kozhikode', 'Thrissur', 'Kollam'],
    'madhya-pradesh': ['Bhopal', 'Indore', 'Gwalior', 'Jabalpur', 'Ujjain'],
    'maharashtra': ['Mumbai', 'Pune', 'Nagpur', 'Thane', 'Nashik'],
    'manipur': ['Imphal', 'Thoubal', 'Bishnupur', 'Churachandpur', 'Kakching'],
    'meghalaya': ['Shillong', 'Tura', 'Cherrapunji', 'Jowai', 'Nongstoin'],
    'mizoram': ['Aizawl', 'Lunglei', 'Saiha', 'Champhai', 'Kolasib'],
    'nagaland': ['Kohima', 'Dimapur', 'Mokokchung', 'Tuensang', 'Wokha'],
    'odisha': ['Bhubaneswar', 'Cuttack', 'Rourkela', 'Berhampur', 'Sambalpur'],
    'punjab': ['Chandigarh', 'Ludhiana', 'Amritsar', 'Jalandhar', 'Patiala'],
    'rajasthan': ['Jaipur', 'Jodhpur', 'Kota', 'Bikaner', 'Udaipur'],
    'sikkim': ['Gangtok', 'Namchi', 'Gyalshing', 'Mangan', 'Rangpo'],
    'tamil-nadu': ['Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Salem'],
    'telangana': ['Hyderabad', 'Warangal', 'Nizamabad', 'Karimnagar', 'Khammam'],
    'tripura': ['Agartala', 'Dharmanagar', 'Udaipur', 'Kailasahar', 'Belonia'],
    'uttar-pradesh': ['Lucknow', 'Kanpur', 'Ghaziabad', 'Agra', 'Varanasi'],
    'uttarakhand': ['Dehradun', 'Haridwar', 'Roorkee', 'Haldwani', 'Rudrapur'],
    'west-bengal': ['Kolkata', 'Howrah', 'Durgapur', 'Asansol', 'Siliguri'],
    'delhi': ['New Delhi', 'North Delhi', 'South Delhi', 'East Delhi', 'West Delhi']
};

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    initializePage();
    setupEventListeners();
    generateCaptcha();
    updateProgress();
});

function initializePage() {
    // Reset form to step 1
    showStep(1);
    
    // Initialize any default values
    document.getElementById('anonymous').checked = true;
    
    // Setup file upload drag and drop
    setupFileUpload();
    
    // Load mock advisories
    loadLatestAdvisories();
}

function setupEventListeners() {
    // Form submission
    document.getElementById('reportForm').addEventListener('submit', handleFormSubmit);
    
    // Reporter mode change
    document.querySelectorAll('input[name="reporterMode"]').forEach(radio => {
        radio.addEventListener('change', toggleReporterMode);
    });
    
    // State change for city population
    document.getElementById('state').addEventListener('change', populateCities);
    
    // Location services
    document.getElementById('getLocationBtn').addEventListener('click', getCurrentLocation);
    
    // Captcha refresh
    document.getElementById('refreshCaptcha').addEventListener('click', generateCaptcha);
    
    // Mobile menu toggle
    document.querySelector('.mobile-menu-toggle').addEventListener('click', toggleMobileMenu);
    
    // File upload
    document.getElementById('evidence').addEventListener('change', handleFileUpload);
}

// Step Navigation Functions
function nextStep() {
    if (validateCurrentStep()) {
        if (currentStep < 5) {
            currentStep++;
            showStep(currentStep);
            updateProgress();
        }
    }
}

function prevStep() {
    if (currentStep > 1) {
        currentStep--;
        showStep(currentStep);
        updateProgress();
    }
}

function showStep(step) {
    // Hide all steps
    document.querySelectorAll('.form-step').forEach(stepEl => {
        stepEl.classList.remove('active');
    });
    
    // Show current step
    document.getElementById(`step${step}`).classList.add('active');
    
    // Update step indicators
    document.querySelectorAll('.step').forEach((stepEl, index) => {
        stepEl.classList.remove('active', 'completed');
        if (index + 1 === step) {
            stepEl.classList.add('active');
        } else if (index + 1 < step) {
            stepEl.classList.add('completed');
        }
    });
    
    // If step 5, populate review
    if (step === 5) {
        populateReview();
    }
    
    // Scroll to top of form
    document.querySelector('.report-section').scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
    });
}

function updateProgress() {
    const progressFill = document.getElementById('progressFill');
    const percentage = (currentStep / 5) * 100;
    progressFill.style.width = `${percentage}%`;
}

// Form Validation
function validateCurrentStep() {
    switch(currentStep) {
        case 1:
            return validateStep1();
        case 2:
            return validateStep2();
        case 3:
            return validateStep3();
        case 4:
            return validateStep4();
        default:
            return true;
    }
}

function validateStep1() {
    const reportType = document.querySelector('input[name="reportType"]:checked');
    if (!reportType) {
        showError('Please select a report type');
        return false;
    }
    return true;
}

function validateStep2() {
    const title = document.getElementById('reportTitle').value.trim();
    const description = document.getElementById('reportDescription').value.trim();
    
    clearErrors();
    
    let isValid = true;
    
    if (!title) {
        showFieldError('reportTitle', 'Report title is required');
        isValid = false;
    }
    
    if (!description) {
        showFieldError('reportDescription', 'Report description is required');
        isValid = false;
    }
    
    return isValid;
}

function validateStep3() {
    // Location is optional, so always valid
    return true;
}

function validateStep4() {
    const reporterMode = document.querySelector('input[name="reporterMode"]:checked').value;
    
    clearErrors();
    
    if (reporterMode === 'anonymous') {
        const captchaInput = document.getElementById('captchaInput').value.trim();
        if (!captchaInput) {
            showFieldError('captchaInput', 'Please enter the captcha');
            return false;
        }
        if (captchaInput !== captchaText) {
            showFieldError('captchaInput', 'Captcha is incorrect');
            generateCaptcha(); // Refresh captcha
            return false;
        }
    } else {
        const name = document.getElementById('reporterName').value.trim();
        const email = document.getElementById('reporterEmail').value.trim();
        
        let isValid = true;
        
        if (!name) {
            showFieldError('reporterName', 'Full name is required');
            isValid = false;
        }
        
        if (!email) {
            showFieldError('reporterEmail', 'Email address is required');
            isValid = false;
        } else if (!isValidEmail(email)) {
            showFieldError('reporterEmail', 'Please enter a valid email address');
            isValid = false;
        }
        
        return isValid;
    }
    
    return true;
}

// Error handling
function showError(message) {
    // Create or update error message
    let errorDiv = document.querySelector('.form-error');
    if (!errorDiv) {
        errorDiv = document.createElement('div');
        errorDiv.className = 'form-error';
        errorDiv.style.cssText = 'background: #fef2f2; color: #dc2626; padding: 1rem; border-radius: 6px; margin-bottom: 1rem; border-left: 4px solid #dc2626;';
        document.querySelector('.form-step.active').insertBefore(errorDiv, document.querySelector('.form-step.active').firstChild);
    }
    errorDiv.innerHTML = `<i class="fas fa-exclamation-triangle"></i> ${message}`;
}

function showFieldError(fieldId, message) {
    const field = document.getElementById(fieldId);
    const formGroup = field.closest('.form-group');
    
    formGroup.classList.add('error');
    
    // Remove existing error message
    const existingError = formGroup.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    // Add new error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
    formGroup.appendChild(errorDiv);
}

function clearErrors() {
    // Remove form-level errors
    const formError = document.querySelector('.form-error');
    if (formError) {
        formError.remove();
    }
    
    // Remove field-level errors
    document.querySelectorAll('.form-group.error').forEach(group => {
        group.classList.remove('error');
        const errorMsg = group.querySelector('.error-message');
        if (errorMsg) {
            errorMsg.remove();
        }
    });
}

// Utility functions
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Reporter Mode Toggle
function toggleReporterMode() {
    const reporterMode = document.querySelector('input[name="reporterMode"]:checked').value;
    const anonymousSection = document.getElementById('anonymousSection');
    const verifiedSection = document.getElementById('verifiedSection');
    
    if (reporterMode === 'anonymous') {
        anonymousSection.style.display = 'block';
        verifiedSection.style.display = 'none';
        
        // Clear verified form fields
        document.getElementById('reporterName').value = '';
        document.getElementById('reporterEmail').value = '';
        document.getElementById('reporterPhone').value = '';
    } else {
        anonymousSection.style.display = 'none';
        verifiedSection.style.display = 'block';
        
        // Clear captcha
        document.getElementById('captchaInput').value = '';
    }
}

// Captcha Generation
function generateCaptcha() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    captchaText = result;
    document.getElementById('captchaText').textContent = result;
    document.getElementById('captchaInput').value = '';
}

// Location Functions
function populateCities() {
    const state = document.getElementById('state').value;
    const citySelect = document.getElementById('city');
    
    // Clear existing options
    citySelect.innerHTML = '<option value="">Choose City</option>';
    
    if (state && stateCityData[state]) {
        stateCityData[state].forEach(city => {
            const option = document.createElement('option');
            option.value = city.toLowerCase().replace(/\s+/g, '-');
            option.textContent = city;
            citySelect.appendChild(option);
        });
    }
}

function getCurrentLocation() {
    const button = document.getElementById('getLocationBtn');
    
    if (!navigator.geolocation) {
        alert('Geolocation is not supported by this browser.');
        return;
    }
    
    // Show loading state
    button.classList.add('loading');
    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Getting Location...';
    
    navigator.geolocation.getCurrentPosition(
        function(position) {
            // In a real app, you would reverse geocode these coordinates
            // For demo purposes, we'll just show a success message
            button.classList.remove('loading');
            button.innerHTML = '<i class="fas fa-check"></i> Location Detected';
            button.style.background = '#22c55e';
            
            // You could populate state/city based on coordinates here
            setTimeout(() => {
                button.innerHTML = '<i class="fas fa-map-marker-alt"></i> Use Current Location';
                button.style.background = '';
            }, 2000);
        },
        function(error) {
            button.classList.remove('loading');
            button.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Location Error';
            button.style.background = '#ef4444';
            
            setTimeout(() => {
                button.innerHTML = '<i class="fas fa-map-marker-alt"></i> Use Current Location';
                button.style.background = '';
            }, 2000);
        }
    );
}

// File Upload Functions
function setupFileUpload() {
    const fileInput = document.getElementById('evidence');
    const uploadLabel = document.querySelector('.file-upload-label');
    
    // Drag and drop functionality
    uploadLabel.addEventListener('dragover', function(e) {
        e.preventDefault();
        uploadLabel.style.borderColor = '#3b82f6';
        uploadLabel.style.background = '#f0f9ff';
    });
    
    uploadLabel.addEventListener('dragleave', function(e) {
        e.preventDefault();
        uploadLabel.style.borderColor = '#d1d5db';
        uploadLabel.style.background = '#fafafa';
    });
    
    uploadLabel.addEventListener('drop', function(e) {
        e.preventDefault();
        uploadLabel.style.borderColor = '#d1d5db';
        uploadLabel.style.background = '#fafafa';
        
        const files = Array.from(e.dataTransfer.files);
        handleFiles(files);
    });
}

function handleFileUpload(event) {
    const files = Array.from(event.target.files);
    handleFiles(files);
}

function handleFiles(files) {
    const fileList = document.getElementById('fileList');
    
    files.forEach(file => {
        // Check file size (limit to 10MB)
        if (file.size > 10 * 1024 * 1024) {
            alert(`File ${file.name} is too large. Maximum size is 10MB.`);
            return;
        }
        
        // Check file type
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
        if (!allowedTypes.includes(file.type)) {
            alert(`File ${file.name} type is not supported.`);
            return;
        }
        
        uploadedFiles.push(file);
        
        // Create file item
        const fileItem = document.createElement('div');
        fileItem.className = 'file-item';
        fileItem.innerHTML = `
            <span><i class="fas fa-file"></i> ${file.name} (${formatFileSize(file.size)})</span>
            <button type="button" class="remove-file" onclick="removeFile(${uploadedFiles.length - 1})">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        fileList.appendChild(fileItem);
    });
}

function removeFile(index) {
    uploadedFiles.splice(index, 1);
    updateFileList();
}

function updateFileList() {
    const fileList = document.getElementById('fileList');
    fileList.innerHTML = '';
    
    uploadedFiles.forEach((file, index) => {
        const fileItem = document.createElement('div');
        fileItem.className = 'file-item';
        fileItem.innerHTML = `
            <span><i class="fas fa-file"></i> ${file.name} (${formatFileSize(file.size)})</span>
            <button type="button" class="remove-file" onclick="removeFile(${index})">
                <i class="fas fa-times"></i>
            </button>
        `;
        fileList.appendChild(fileItem);
    });
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Review Section Population
function populateReview() {
    const reviewSection = document.getElementById('reviewSection');
    const reportType = document.querySelector('input[name="reportType"]:checked');
    const reporterMode = document.querySelector('input[name="reporterMode"]:checked');
    
    let reviewHTML = '';
    
    // Report Type
    if (reportType) {
        reviewHTML += `
            <div class="review-item">
                <div class="review-label">Report Type:</div>
                <div class="review-value">${reportType.nextElementSibling.querySelector('span').textContent}</div>
            </div>
        `;
    }
    
    // Title and Description
    const title = document.getElementById('reportTitle').value;
    const description = document.getElementById('reportDescription').value;
    
    if (title) {
        reviewHTML += `
            <div class="review-item">
                <div class="review-label">Title:</div>
                <div class="review-value">${title}</div>
            </div>
        `;
    }
    
    if (description) {
        reviewHTML += `
            <div class="review-item">
                <div class="review-label">Description:</div>
                <div class="review-value">${description}</div>
            </div>
        `;
    }
    
    // URL
    const url = document.getElementById('socialUrl').value;
    if (url) {
        reviewHTML += `
            <div class="review-item">
                <div class="review-label">URL/Link:</div>
                <div class="review-value">${url}</div>
            </div>
        `;
    }
    
    // Files
    if (uploadedFiles.length > 0) {
        reviewHTML += `
            <div class="review-item">
                <div class="review-label">Attached Files:</div>
                <div class="review-value">${uploadedFiles.map(f => f.name).join(', ')}</div>
            </div>
        `;
    }
    
    // Location
    const state = document.getElementById('state').value;
    const city = document.getElementById('city').value;
    if (state || city) {
        const stateText = state ? document.querySelector(`#state option[value="${state}"]`).textContent : '';
        const cityText = city ? document.querySelector(`#city option[value="${city}"]`).textContent : '';
        reviewHTML += `
            <div class="review-item">
                <div class="review-label">Location:</div>
                <div class="review-value">${cityText ? cityText + ', ' : ''}${stateText}</div>
            </div>
        `;
    }
    
    // Reporter Info
    reviewHTML += `
        <div class="review-item">
            <div class="review-label">Report Mode:</div>
            <div class="review-value">${reporterMode.value === 'anonymous' ? 'Anonymous Report' : 'Verified Report'}</div>
        </div>
    `;
    
    if (reporterMode.value === 'verified') {
        const name = document.getElementById('reporterName').value;
        const email = document.getElementById('reporterEmail').value;
        
        if (name) {
            reviewHTML += `
                <div class="review-item">
                    <div class="review-label">Reporter Name:</div>
                    <div class="review-value">${name}</div>
                </div>
            `;
        }
        
        if (email) {
            reviewHTML += `
                <div class="review-item">
                    <div class="review-label">Email:</div>
                    <div class="review-value">${email}</div>
                </div>
            `;
        }
    }
    
    reviewSection.innerHTML = reviewHTML;
}

// Form Submission
function handleFormSubmit(event) {
    event.preventDefault();
    
    if (!validateCurrentStep()) {
        return;
    }
    
    // Show loading state
    const submitBtn = document.querySelector('.submit-btn');
    submitBtn.classList.add('loading');
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
    
    // Collect form data
    collectFormData();
    
    // Simulate API call
    setTimeout(() => {
        submitReport();
    }, 2000);
}

function collectFormData() {
    formData = {
        reportType: document.querySelector('input[name="reportType"]:checked')?.value,
        title: document.getElementById('reportTitle').value,
        description: document.getElementById('reportDescription').value,
        url: document.getElementById('socialUrl').value,
        files: uploadedFiles,
        state: document.getElementById('state').value,
        city: document.getElementById('city').value,
        reporterMode: document.querySelector('input[name="reporterMode"]:checked')?.value,
        reporterName: document.getElementById('reporterName').value,
        reporterEmail: document.getElementById('reporterEmail').value,
        reporterPhone: document.getElementById('reporterPhone').value,
        timestamp: new Date().toISOString()
    };
}

function submitReport() {
    // Generate reference ID
    const referenceId = generateReferenceId();
    
    // Hide form and show success message
    document.getElementById('reportForm').style.display = 'none';
    document.querySelector('.form-progress').style.display = 'none';
    document.getElementById('successMessage').style.display = 'block';
    document.getElementById('referenceId').textContent = referenceId;
    
    // Store reference for receipt
    localStorage.setItem('lastReportId', referenceId);
    localStorage.setItem('lastReportData', JSON.stringify(formData));
    
    // Scroll to success message
    document.getElementById('successMessage').scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center' 
    });
}

function generateReferenceId() {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    
    return `CR${year}${month}${day}${random}`;
}

// Success Actions
function downloadReceipt() {
    const referenceId = document.getElementById('referenceId').textContent;
    const reportData = JSON.parse(localStorage.getItem('lastReportData'));
    
    // Create receipt content
    const receiptContent = `
        GOVERNMENT CYBERCRIME PORTAL
        =============================
        
        REPORT RECEIPT
        
        Reference ID: ${referenceId}
        Date: ${new Date().toLocaleDateString()}
        Time: ${new Date().toLocaleTimeString()}
        
        Report Type: ${getReportTypeText(reportData.reportType)}
        Title: ${reportData.title}
        
        Reporter Mode: ${reportData.reporterMode === 'anonymous' ? 'Anonymous' : 'Verified'}
        ${reportData.reporterMode === 'verified' && reportData.reporterName ? `Reporter: ${reportData.reporterName}` : ''}
        
        Status: Submitted Successfully
        Expected Review Time: 24-48 hours
        
        For queries, contact: 1930
        
        =============================
        This is a computer-generated receipt.
    `;
    
    // Create and download file
    const blob = new Blob([receiptContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Report_Receipt_${referenceId}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
}

function submitNewReport() {
    // Reset form
    document.getElementById('reportForm').reset();
    uploadedFiles = [];
    updateFileList();
    currentStep = 1;
    
    // Show form again
    document.getElementById('reportForm').style.display = 'block';
    document.querySelector('.form-progress').style.display = 'block';
    document.getElementById('successMessage').style.display = 'none';
    
    showStep(1);
    updateProgress();
    generateCaptcha();
    
    // Scroll to top
    document.querySelector('.report-section').scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
    });
}

function getReportTypeText(value) {
    const typeMap = {
        'fake-news': 'Fake News / Misinformation',
        'hate-speech': 'Hate Speech / Harassment',
        'fraudulent-account': 'Fraudulent Account / Impersonation',
        'exploitative-content': 'Objectionable / Exploitative Content',
        'other': 'Other'
    };
    return typeMap[value] || value;
}

// Advisory Functions
function loadLatestAdvisories() {
    // Mock data - in a real app, this would come from an API
    const advisories = [
        {
            date: 'Dec 28, 2024',
            title: 'Fake COVID-19 Vaccine Registration',
            description: 'Beware of fake vaccination certificate websites asking for personal information...',
            link: '#advisory-1'
        },
        {
            date: 'Dec 27, 2024',
            title: 'WhatsApp Lottery Scam Alert',
            description: 'Messages claiming lottery wins are fraudulent. Do not share personal details...',
            link: '#advisory-2'
        },
        {
            date: 'Dec 26, 2024',
            title: 'Banking SMS Phishing',
            description: 'Fake SMS requesting bank details on the rise. Banks never ask for OTP via SMS...',
            link: '#advisory-3'
        },
        {
            date: 'Dec 25, 2024',
            title: 'Social Media Account Hacking',
            description: 'Increase in compromised social media accounts. Enable two-factor authentication...',
            link: '#advisory-4'
        }
    ];
    
    // This could be enhanced to fetch real-time data
    updateAdvisoryDisplay(advisories);
}

function updateAdvisoryDisplay(advisories) {
    // Advisory items are already in HTML, but this function could update them dynamically
    // For now, we'll just add a refresh timestamp
    const advisoryList = document.getElementById('advisoryList');
    
    // Add a last updated indicator
    const lastUpdated = document.createElement('div');
    lastUpdated.className = 'last-updated';
    lastUpdated.style.cssText = 'font-size: 0.75rem; color: #6b7280; text-align: center; margin-top: 1rem; padding-top: 1rem; border-top: 1px solid #e5e7eb;';
    lastUpdated.textContent = `Last updated: ${new Date().toLocaleTimeString()}`;
    
    // Remove existing last updated if present
    const existing = advisoryList.querySelector('.last-updated');
    if (existing) {
        existing.remove();
    }
    
    advisoryList.appendChild(lastUpdated);
}

// Mobile Menu Toggle
function toggleMobileMenu() {
    const navMenu = document.querySelector('.nav-menu');
    const toggle = document.querySelector('.mobile-menu-toggle');
    
    if (navMenu.style.display === 'flex') {
        navMenu.style.display = 'none';
        toggle.innerHTML = '<i class="fas fa-bars"></i>';
    } else {
        navMenu.style.display = 'flex';
        navMenu.style.flexDirection = 'column';
        navMenu.style.position = 'absolute';
        navMenu.style.top = '100%';
        navMenu.style.left = '0';
        navMenu.style.right = '0';
        navMenu.style.background = '#1e3a8a';
        navMenu.style.padding = '1rem';
        navMenu.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
        toggle.innerHTML = '<i class="fas fa-times"></i>';
    }
}

// Utility Functions for Enhanced UX
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;
    notification.innerHTML = `
        <div style="display: flex; align-items: center; gap: 0.5rem;">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
            <button onclick="this.parentElement.parentElement.remove()" style="background: none; border: none; color: white; margin-left: 1rem; cursor: pointer;">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 5000);
}

// Auto-save functionality
function autoSaveForm() {
    const formData = new FormData(document.getElementById('reportForm'));
    const autoSaveData = {};
    
    for (let [key, value] of formData.entries()) {
        autoSaveData[key] = value;
    }
    
    localStorage.setItem('reportFormAutoSave', JSON.stringify(autoSaveData));
}

function loadAutoSavedData() {
    const savedData = localStorage.getItem('reportFormAutoSave');
    if (savedData) {
        const data = JSON.parse(savedData);
        
        Object.keys(data).forEach(key => {
            const field = document.getElementById(key) || document.querySelector(`input[name="${key}"]`);
            if (field) {
                field.value = data[key];
            }
        });
    }
}

// Auto-save every 30 seconds
setInterval(autoSaveForm, 30000);

// Form field change listeners for auto-save
document.addEventListener('input', function(e) {
    if (e.target.form && e.target.form.id === 'reportForm') {
        clearTimeout(window.autoSaveTimeout);
        window.autoSaveTimeout = setTimeout(autoSaveForm, 1000);
    }
});

// Accessibility enhancements
document.addEventListener('keydown', function(e) {
    // Allow navigation with arrow keys in form steps
    if (e.target.closest('.report-form')) {
        if (e.key === 'ArrowRight' && e.ctrlKey) {
            e.preventDefault();
            nextStep();
        } else if (e.key === 'ArrowLeft' && e.ctrlKey) {
            e.preventDefault();
            prevStep();
        }
    }
});

// Add animation styles dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    .notification {
        animation: slideIn 0.3s ease;
    }
`;
document.head.appendChild(style);

// Initialize auto-saved data on page load
document.addEventListener('DOMContentLoaded', function() {
    loadAutoSavedData();
});

// Security: Clear sensitive data on page unload
window.addEventListener('beforeunload', function() {
    // Clear auto-save data when leaving page
    localStorage.removeItem('reportFormAutoSave');
});

// Refresh advisories periodically (every 5 minutes)
setInterval(loadLatestAdvisories, 5 * 60 * 1000);

// Form field animations and interactions
document.addEventListener('DOMContentLoaded', function() {
    // Add focus animations to form fields
    const formFields = document.querySelectorAll('input, textarea, select');
    formFields.forEach(field => {
        field.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        
        field.addEventListener('blur', function() {
            this.parentElement.classList.remove('focused');
        });
    });
});

// Add CSS for focus animations
const focusStyle = document.createElement('style');
focusStyle.textContent = `
    .form-group.focused label {
        color: #3b82f6;
        transform: translateY(-2px);
        transition: all 0.2s ease;
    }
`;
document.head.appendChild(focusStyle);
