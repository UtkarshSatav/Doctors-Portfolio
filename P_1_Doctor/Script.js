document.addEventListener('DOMContentLoaded', function() {
    // Appointment Form Functionality
    const dateInput = document.getElementById('date');
    const timeSelect = document.getElementById('time');
    const form = document.getElementById('appointmentForm');
    
    // Testimonial Infinite Scroll
    function setupTestimonialTracks() {
        const tracks = document.querySelectorAll('.testimonial-track');
        
        tracks.forEach((track, index) => {
            // Store the original cards
            const originalCards = Array.from(track.children);
            
            // Duplicate the cards for seamless looping
            const clonedCards = originalCards.map(card => {
                const clone = card.cloneNode(true);
                clone.setAttribute('aria-hidden', 'true');
                return clone;
            });
            
            // Append the cloned cards
            clonedCards.forEach(clone => track.appendChild(clone));
            
            // Set animation duration based on number of cards
            const speed = index === 0 ? 40 : 45; // Different speeds for each track
            track.style.animationDuration = `${speed}s`;
            
            // Pause animation when hovering over any card in the track
            track.querySelectorAll('.testimonial-card').forEach(card => {
                card.addEventListener('mouseenter', () => {
                    track.style.animationPlayState = 'paused';
                });
                
                card.addEventListener('mouseleave', () => {
                    track.style.animationPlayState = 'running';
                });
            });
            
            // Handle animation iteration to create seamless loop
            track.addEventListener('animationiteration', () => {
                // Smoothly reset position without visual glitch
                track.style.transition = 'none';
                track.style.transform = 'translateX(0)';
                
                // Force reflow to ensure the transform is applied
                void track.offsetWidth;
                
                // Re-enable transitions
                setTimeout(() => {
                    track.style.transition = 'transform 0.3s linear';
                }, 0);
            });
        });
    }
    
    // Initialize testimonial tracks
    if (document.querySelector('.testimonial-track')) {
        setupTestimonialTracks();
    }
    
    // Set minimum date to today
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const yyyy = today.getFullYear();
    const minDate = yyyy + '-' + mm + '-' + dd;
    dateInput.setAttribute('min', minDate);
    
    // Generate time slots (9:00 AM to 9:30 PM, 30-minute intervals)
    function generateTimeSlots() {
        timeSelect.innerHTML = '<option value="">Select a time</option>';
        
        // Check if a date is selected
        if (!dateInput.value) return;
        
        const selectedDate = new Date(dateInput.value);
        const today = new Date();
        
        // If selected date is today, only show future time slots
        const isToday = selectedDate.toDateString() === today.toDateString();
        const currentHour = today.getHours();
        const currentMinute = today.getMinutes();
        
        // Generate time slots from 9:00 AM to 9:30 PM (21:30) in 30-minute intervals
        for (let hour = 9; hour <= 21; hour++) {
            // Skip hours after 21:00 (9:00 PM) for the 9:30 slot
            if (hour === 21) break;
            
            // For each hour, create two time slots (00 and 30 minutes)
            for (let minute = 0; minute < 60; minute += 30) {
                // Skip times that have already passed for today
                if (isToday) {
                    if (hour < currentHour || (hour === currentHour && minute < currentMinute)) {
                        continue;
                    }
                }
                
                const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
                const displayTime = formatTime(hour, minute);
                
                const option = document.createElement('option');
                option.value = timeString;
                option.textContent = displayTime;
                timeSelect.appendChild(option);
            }
        }
    }
    
    // Format time as 12-hour with AM/PM
    function formatTime(hour, minute) {
        const period = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour % 12 || 12; // Convert 0 to 12 for 12 AM
        return `${displayHour}:${minute.toString().padStart(2, '0')} ${period}`;
    }
    
    // Event listeners
    dateInput.addEventListener('change', generateTimeSlots);
    
    // Form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Basic form validation
        if (!form.checkValidity()) {
            alert('Please fill in all required fields.');
            return;
        }
        
        // Get form data
        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            date: dateInput.value,
            time: timeSelect.options[timeSelect.selectedIndex].text,
            message: document.getElementById('message').value
        };
        
        // Here you would typically send this data to a server
        console.log('Appointment booked:', formData);
        
        // Show success message
        alert('Your appointment has been booked successfully! We will contact you shortly to confirm.');
        form.reset();
    });
    
    // Initialize time slots if date is already selected (e.g., if page is refreshed)
    if (dateInput.value) {
        generateTimeSlots();
    }
});