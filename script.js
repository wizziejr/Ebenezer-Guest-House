document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        
        // Toggle between hamburger and close icon
        const icon = hamburger.querySelector('i');
        if (navLinks.classList.contains('active')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });

    // Close mobile menu when a link is clicked
    document.querySelectorAll('.nav-links li a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            hamburger.querySelector('i').classList.remove('fa-times');
            hamburger.querySelector('i').classList.add('fa-bars');
        });
    });

    // --- Gallery Slider Functionality ---
    const slides = document.querySelectorAll('.slide');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    let currentSlide = 0;

    function updateSlider() {
        // Remove all classes first
        slides.forEach(slide => {
            slide.classList.remove('active', 'prev', 'next');
        });

        // Set the active slide
        slides[currentSlide].classList.add('active');
        
        // Calculate previous and next indexes infinitely
        let prevIndex = (currentSlide - 1 + slides.length) % slides.length;
        let nextIndex = (currentSlide + 1) % slides.length;

        // Assign prev and next classes
        slides[prevIndex].classList.add('prev');
        slides[nextIndex].classList.add('next');
    }

    if (slides.length > 0) {
        updateSlider(); // Initialize on load

        nextBtn.addEventListener('click', () => {
            currentSlide = (currentSlide + 1) % slides.length;
            updateSlider();
        });

        prevBtn.addEventListener('click', () => {
            currentSlide = (currentSlide - 1 + slides.length) % slides.length;
            updateSlider();
        });

        // Bonus: Allows users to click on the side images to slide to them
        slides.forEach((slide) => {
            slide.addEventListener('click', () => {
                if (slide.classList.contains('prev')) {
                    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
                    updateSlider();
                } else if (slide.classList.contains('next')) {
                    currentSlide = (currentSlide + 1) % slides.length;
                    updateSlider();
                }
            });
        });
    }
    // --- Booking Form: WhatsApp Submission ---
    function calculateTotal() {
        const checkIn = document.getElementById('checkIn').value;
        const checkOut = document.getElementById('checkOut').value;
        const accommodation = document.getElementById('accommodation').value;
        const priceDisplay = document.getElementById('priceDisplay');
        const totalCostSpan = document.getElementById('totalCost');

        if (checkIn && checkOut && accommodation) {
            const startDate = new Date(checkIn);
            const endDate = new Date(checkOut);

            const diffTime = endDate - startDate;
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            if (diffDays > 0) {
                const pricePerNight = parseInt(accommodation);
                const totalCost = diffDays * pricePerNight;
                totalCostSpan.innerText = totalCost.toLocaleString('en-US');
                priceDisplay.style.display = 'block';
            } else {
                priceDisplay.style.display = 'none';
                if (diffDays <= 0 && checkOut !== "") {
                    alert("Check-out date must be after the check-in date.");
                    document.getElementById('checkOut').value = "";
                }
            }
        } else {
            priceDisplay.style.display = 'none';
        }
    }

    // Expose calculateTotal so inline onchange attributes can call it
    window.calculateTotal = calculateTotal;

    const bookingForm = document.getElementById('bookingForm');
    if (bookingForm) {

        bookingForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const fullName          = document.getElementById('fullName').value.trim();
            const phone             = document.getElementById('phone').value.trim();
            const checkIn           = document.getElementById('checkIn').value;
            const checkOut          = document.getElementById('checkOut').value;
            const accommodation     = document.getElementById('accommodation');
            const accommodationText = accommodation.options[accommodation.selectedIndex].text;
            const totalCost         = document.getElementById('totalCost').innerText;
            const diffDays          = Math.ceil((new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24));

            const notification = document.getElementById('bookingNotification');
            const submitBtn    = document.getElementById('submitBtn');

            const message =
                `🏡 *New Booking – Ebenezer Guest House*\n\n` +
                `👤 *Name:* ${fullName}\n` +
                `📞 *Phone:* ${phone}\n` +
                `📅 *Check-in:* ${checkIn}\n` +
                `📅 *Check-out:* ${checkOut}\n` +
                `🌙 *Nights:* ${diffDays}\n` +
                `🛏️ *Room:* ${accommodationText}\n` +
                `💰 *Total:* ${totalCost} MWK\n\n` +
                `Please confirm availability. Thank you!`;

            // Disable button immediately
            submitBtn.disabled    = true;
            submitBtn.textContent = 'Sending…';
            notification.style.display = 'none';
            notification.className     = 'booking-notification';

            const apiURL =
                `https://api.callmebot.com/whatsapp.php` +
                `?phone=265995888096` +
                `&text=${encodeURIComponent(message)}` +
                `&apikey=ygfqaMcdhlvfNP`;

            // no-cors: browser can't read the response but the request IS sent 
            // and CallMeBot delivers the WhatsApp message as normal.
            fetch(apiURL, { mode: 'no-cors' })
                .then(() => {
                    // Request went through — show success
                    notification.className = 'booking-notification success';
                    notification.innerHTML =
                        `<strong>✅ Booking request sent!</strong><br>` +
                        `Thank you, <em>${fullName}</em>. We have received your booking and will get back to you shortly on <strong>${phone}</strong>.`;
                    notification.style.display = 'block';
                    bookingForm.reset();
                    document.getElementById('priceDisplay').style.display = 'none';
                })
                .catch(() => {
                    notification.className = 'booking-notification error';
                    notification.innerHTML =
                        `<strong>❌ Could not send booking.</strong><br>` +
                        `Please call us on <strong>+265 995 888 096</strong> or try again.`;
                    notification.style.display = 'block';
                })
                .finally(() => {
                    submitBtn.disabled    = false;
                    submitBtn.textContent = 'Send Booking Request';
                    notification.scrollIntoView({ behavior: 'smooth', block: 'center' });
                });
        });
    }
});