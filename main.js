  // DOM Elements
        const themeToggle = document.getElementById('themeToggle');
        const body = document.body;
        const startBtn = document.getElementById('startBtn');
        const questionnaire = document.getElementById('questionnaire');
        const results = document.getElementById('results');
        const resultsContent = document.getElementById('resultsContent');
        const chatContainer = document.getElementById('chatContainer');
        const chatMessages = document.getElementById('chatMessages');
        const userInput = document.getElementById('userInput');
        const progressFill = document.getElementById('progressFill');
        const progressText = document.getElementById('progressText');
        const questionsContainer = document.getElementById('questionsContainer');

        // Questions Data
        const questions = [
            {
                id: 'q1',
                question: '1. რომელი სფერო გაინტერესებთ ყველაზე მეტად?',
                options: [
                    'მეცნიერება და ტექნოლოგიები',
                    'ბიზნესი და ეკონომიკა',
                    'ხელოვნება და ჰუმანიტარული მეცნიერებები',
                    'მედიცინა და ჯანმრთელობა',
                    'სოციალური მეცნიერებები',
                    'ინჟინერია'
                ]
            },
            {
                id: 'q2',
                question: '2. რა ტიპის უნივერსიტეტი გირჩევნიათ?',
                options: [
                    'სახელმწიფო უნივერსიტეტი',
                    'კერძო უნივერსიტეტი'
                ]
            },
            {
                id: 'q3',
                question: '3. რა არის ყველაზე მნიშვნელოვანი უნივერსიტეტის არჩევისას?',
                options: [
                    'აკადემიური რეპუტაცია',
                    'დასაქმების მაჩვენებელი',
                    'სტუდენტური ცხოვრება',
                    'ფასი და სტიპენდიის შესაძლებლობა',
                    'მდებარეობა',
                    'პრაქტიკული გამოცდილების მიღება'
                ]
            },
            {
                id: 'q4',
                question: '4. რა არის თქვენი ბიუჯეტი სწავლისთვის (წელიწადში)?',
                options: [
                    '2,000 ლარამდე',
                    '2,000-5,000 ლარი',
                    '5,000-10,000 ლარი',
                    '10,000 ლარზე მეტი',
                    'მხოლოდ სტიპენდიის პირობებში'
                ]
            },
            {
                id: 'q5',
                question: '5. რა არის თქვენი კარიერული მიზნები?',
                options: [
                    'მეცნიერება/აკადემიური კარიერა',
                    'კორპორატიული კარიერა',
                    'საკუთარი ბიზნესი',
                    'საჯარო სექტორი',
                    'შემოქმედებითი პროფესია',
                    'ჯერ არ ვიცი'
                ]
            }
        ];

        // State
        let currentQuestion = 0;
        const answers = {};

        // Initialize the application
        document.addEventListener('DOMContentLoaded', () => {
            initTheme();
            renderQuestions();
            showQuestion(0);
            
            // Hide sections initially
            questionnaire.style.display = 'none';
            results.style.display = 'none';
            chatContainer.style.display = 'none';
        });

        // Theme functionality
        function initTheme() {
            const savedTheme = localStorage.getItem('theme');
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

            if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
                body.classList.add('dark-mode');
            }

            themeToggle.addEventListener('click', toggleTheme);
        }

        function toggleTheme() {
            body.classList.toggle('dark-mode');
            localStorage.setItem('theme', body.classList.contains('dark-mode') ? 'dark' : 'light');
        }

        // Start questionnaire
        startBtn.addEventListener('click', () => {
            document.querySelector('.hero').style.display = 'none';
            questionnaire.style.display = 'block';
            questionnaire.classList.add('animate__animated', 'animate__fadeIn');
        });

        // Questionnaire functionality
        function renderQuestions() {
            questionsContainer.innerHTML = questions.map((q, index) => `
                <div class="question" id="${q.id}" data-index="${index}">
                    <h3>${q.question}</h3>
                    <div class="options">
                        ${q.options.map(opt => `
                            <div class="option" onclick="selectOption(this, '${q.id}')">
                                ${opt}
                                <span class="option-check">✓</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `).join('') + `
                <div class="navigation">
                    <button class="nav-btn" id="prevBtn" onclick="prevQuestion()" disabled>
                        <svg viewBox="0 0 24 24" width="18" height="18">
                            <path fill="currentColor" d="M15.41,16.58L10.83,12L15.41,7.41L14,6L8,12L14,18L15.41,16.58Z"></path>
                        </svg>
                        წინა
                    </button>
                    <button class="nav-btn" id="nextBtn" onclick="nextQuestion()">
                        შემდეგი
                        <svg viewBox="0 0 24 24" width="18" height="18">
                            <path fill="currentColor" d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z"></path>
                        </svg>
                    </button>
                    <button class="nav-btn" id="submitBtn" onclick="submitQuestionnaire()" style="display: none;">
                        რეკომენდაციების მიღება
                        <svg viewBox="0 0 24 24" width="18" height="18">
                            <path fill="currentColor" d="M4,11V13H16L10.5,18.5L11.92,19.92L19.84,12L11.92,4.08L10.5,5.5L16,11H4Z"></path>
                        </svg>
                    </button>
                </div>
            `;
        }

        function showQuestion(index) {
            // Update progress
            const progressPercent = ((index + 1) / questions.length) * 100;
            progressFill.style.width = `${progressPercent}%`;
            progressText.textContent = `${index + 1}/${questions.length}`;

            // Show/hide questions
            document.querySelectorAll('.question').forEach((q, i) => {
                if (i === index) {
                    q.classList.add('active');
                    q.style.animation = 'fadeInUp 0.5s ease';
                } else {
                    q.classList.remove('active');
                }
            });
            
            // Update navigation buttons
            document.getElementById('prevBtn').disabled = index === 0;
            
            if (index === questions.length - 1) {
                document.getElementById('nextBtn').style.display = 'none';
                document.getElementById('submitBtn').style.display = 'flex';
            } else {
                document.getElementById('nextBtn').style.display = 'flex';
                document.getElementById('submitBtn').style.display = 'none';
            }
            
            // Smooth scroll to question
            document.querySelector(`#${questions[index].id}`).scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }

        function nextQuestion() {
            if (currentQuestion < questions.length - 1) {
                currentQuestion++;
                showQuestion(currentQuestion);
            }
        }

        function prevQuestion() {
            if (currentQuestion > 0) {
                currentQuestion--;
                showQuestion(currentQuestion);
            }
        }

        function selectOption(option, questionId) {
            const options = document.querySelectorAll(`#${questionId} .option`);
            options.forEach(opt => {
                opt.classList.remove('selected');
                opt.querySelector('.option-check').style.transform = 'scale(0)';
            });
            
            option.classList.add('selected');
            option.querySelector('.option-check').style.transform = 'scale(1)';
            answers[questionId] = option.textContent.trim();
            
            // Add ripple effect
            const ripple = document.createElement('span');
            ripple.classList.add('ripple-effect');
            option.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        }

        async function submitQuestionnaire() {
            // Check for unanswered questions
            const unanswered = questions.filter(q => !answers[q.id]).map(q => q.id.replace('q', ''));
            
            if (unanswered.length > 0) {
                const errorMessage = document.createElement('div');
                errorMessage.className = 'error-message animate__animated animate__shakeX';
                errorMessage.textContent = `გთხოვთ უპასუხოთ კითხვებს: ${unanswered.join(', ')}`;
                
                const activeQuestion = document.querySelector('.question.active');
                activeQuestion.insertBefore(errorMessage, activeQuestion.querySelector('.options'));
                
                setTimeout(() => {
                    errorMessage.remove();
                }, 3000);
                
                showQuestion(parseInt(unanswered[0]) - 1);
                return;
            }
            
            // Show loading state
            questionnaire.style.opacity = '0.5';
            questionnaire.style.pointerEvents = 'none';
            
            results.style.display = 'block';
            results.style.opacity = '0';
            results.style.transform = 'translateY(20px)';
            
            resultsContent.innerHTML = `
                <div class="loading">
                    <div class="spinner"></div>
                    <p>თქვენი პასუხების ანალიზი და რეკომენდაციების მომზადება...</p>
                </div>
            `;
            
            setTimeout(() => {
                results.style.opacity = '1';
                results.style.transform = 'translateY(0)';
                results.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            }, 100);
            
            try {
                // Get recommendations
                const universityRecommendations = await getUniversityRecommendations(answers);
                const professionRecommendations = await getProfessionRecommendations(answers);
                
                // Hide loading and show results
                resultsContent.innerHTML = `
                    <div class="recommendations-intro animate__animated animate__fadeIn">
                        <h3>თქვენი პერსონალური რეკომენდაციები</h3>
                        <p>ჩვენი სისტემის ანალიზის საფუძველზე, აქ მოცემულია თქვენთვის საუკეთესო ვარიანტები:</p>
                    </div>
                    
                    <div class="profession-section">
                        <h4><i class="fas fa-briefcase"></i> თქვენთვის რეკომენდირებული პროფესიები</h4>
                        <div class="profession-list">
                            ${professionRecommendations}
                        </div>
                    </div>
                    
                    <h4 class="university-recommendations-title"><i class="fas fa-university"></i> თქვენთვის რეკომენდირებული უნივერსიტეტები</h4>
                    <div class="university-list">
                        ${universityRecommendations}
                    </div>
                `;
                
                // Show chat
                chatContainer.style.display = 'block';
                chatContainer.style.animation = 'fadeIn 0.5s ease';
                
                // Scroll to results
                results.scrollIntoView({ behavior: 'smooth' });
            } catch (error) {
                resultsContent.innerHTML = `
                    <div class="error animate__animated animate__shakeX">
                        <p>ვწუხვართ, რეკომენდაციების მომზადებისას დაფიქსირდა შეცდომა.</p>
                        <p>${error.message}</p>
                        <button class="nav-btn" onclick="window.location.reload()">
                            სცადეთ ხელახლა
                            <svg viewBox="0 0 24 24" width="18" height="18">
                                <path fill="currentColor" d="M17.65,6.35C16.2,4.9 14.21,4 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20C15.73,20 18.84,17.45 19.73,14H17.65C16.83,16.33 14.61,18 12,18A6,6 0 0,1 6,12A6,6 0 0,1 12,6C13.66,6 15.14,6.69 16.22,7.78L13,11H20V4L17.65,6.35Z"></path>
                            </svg>
                        </button>
                    </div>
                `;
            } finally {
                questionnaire.style.opacity = '1';
                questionnaire.style.pointerEvents = 'auto';
            }
        }

        // University Recommendations
        async function getUniversityRecommendations(answers) {
            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            const budget = answers.q4;
            let budgetText = "";
            
            if (budget.includes("2,000 ლარამდე")) {
                budgetText = "ეს უნივერსიტეტი შესაფერისია თქვენი ბიუჯეტისთვის";
            } else if (budget.includes("2,000-5,000")) {
                budgetText = "ეს უნივერსიტეტი შედის თქვენს ბიუჯეტში";
            } else if (budget.includes("5,000-10,000")) {
                budgetText = "ეს პროგრამა შეესაბამება თქვენს ბიუჯეტს";
            } else if (budget.includes("10,000 ლარზე მეტი")) {
                budgetText = "ეს პრესტიჟული პროგრამა შეესაბამება თქვენს ბიუჯეტს";
            } else {
                budgetText = "ამ უნივერსიტეტში ხელმისაწვდომია სტიპენდიის პროგრამები";
            }
            
            const faculty = getFaculty(answers.q1);
            const isPrivate = answers.q2.includes('კერძო');
            
            if (isPrivate) {
                return `
                    <div class="university-card animate__animated animate__fadeInUp">
                        <div class="university-header">
                            <h3>ქართული ამერიკული უნივერსიტეტი</h3>
                            <span class="university-badge">კერძო</span>
                        </div>
                        <div class="university-body">
                            <p class="faculty-info"><i class="fas fa-graduation-cap"></i> <strong>ფაკულტეტი:</strong> ${faculty}</p>
                            <p class="match-reason">ამერიკული სასწავლო მოდელი და საერთაშორისო ხარისხის განათლება თქვენს ინტერესებს შეესაბამება.</p>
                            <div class="university-stats">
                                <div class="stat-item">
                                    <span class="stat-icon"><i class="fas fa-money-bill-wave"></i></span>
                                    <span class="stat-value">8,000-12,000 ლარი წელიწადში</span>
                                </div>
                                <div class="stat-item">
                                    <span class="stat-icon"><i class="fas fa-award"></i></span>
                                    <span class="stat-value">მაღალი ქულების მქონე სტუდენტებისთვის</span>
                                </div>
                            </div>
                            <div class="budget-info">
                                <p>${budgetText}</p>
                            </div>
                            <button class="more-info-btn"><i class="fas fa-info-circle"></i> მეტი ინფორმაცია</button>
                        </div>
                    </div>
                    
                    <div class="university-card animate__animated animate__fadeInUp" style="animation-delay: 0.2s">
                        <div class="university-header">
                            <h3>კავკასიის უნივერსიტეტი</h3>
                            <span class="university-badge">კერძო</span>
                        </div>
                        <div class="university-body">
                            <p class="faculty-info"><i class="fas fa-graduation-cap"></i> <strong>ფაკულტეტი:</strong> ${faculty}</p>
                            <p class="match-reason">თანამედროვე ინფრასტრუქტურა და პრაქტიკაზე ორიენტირებული სწავლება თქვენი მიზნებისთვის იდეალურია.</p>
                            <div class="university-stats">
                                <div class="stat-item">
                                    <span class="stat-icon"><i class="fas fa-money-bill-wave"></i></span>
                                    <span class="stat-value">5,000-8,000 ლარი წელიწადში</span>
                                </div>
                                <div class="stat-item">
                                    <span class="stat-icon"><i class="fas fa-award"></i></span>
                                    <span class="stat-value">სხვადასხვა სახის ფინანსური დახმარება</span>
                                </div>
                            </div>
                            <div class="budget-info">
                                <p>${budgetText}</p>
                            </div>
                            <button class="more-info-btn"><i class="fas fa-info-circle"></i> მეტი ინფორმაცია</button>
                        </div>
                    </div>
                `;
            } else {
                return `
                    <div class="university-card animate__animated animate__fadeInUp">
                        <div class="university-header">
                            <h3>თბილისის სახელმწიფო უნივერსიტეტი</h3>
                            <span class="university-badge">სახელმწიფო</span>
                        </div>
                        <div class="university-body">
                            <p class="faculty-info"><i class="fas fa-graduation-cap"></i> <strong>ფაკულტეტი:</strong> ${faculty}</p>
                            <p class="match-reason">საქართველოს უძველესი და ყველაზე პრესტიჟული უნივერსიტეტი თქვენს ინტერესებს შეესაბამება.</p>
                            <div class="university-stats">
                                <div class="stat-item">
                                    <span class="stat-icon"><i class="fas fa-money-bill-wave"></i></span>
                                    <span class="stat-value">2,250-4,500 ლარი წელიწადში</span>
                                </div>
                                <div class="stat-item">
                                    <span class="stat-icon"><i class="fas fa-award"></i></span>
                                    <span class="stat-value">მაღალი აკადემიური მოსწრებისთვის</span>
                                </div>
                            </div>
                            <div class="budget-info">
                                <p>${budgetText}</p>
                            </div>
                            <button class="more-info-btn"><i class="fas fa-info-circle"></i> მეტი ინფორმაცია</button>
                        </div>
                    </div>
                    
                    <div class="university-card animate__animated animate__fadeInUp" style="animation-delay: 0.2s">
                        <div class="university-header">
                            <h3>ილიას სახელმწიფო უნივერსიტეტი</h3>
                            <span class="university-badge">სახელმწიფო</span>
                        </div>
                        <div class="university-body">
                            <p class="faculty-info"><i class="fas fa-graduation-cap"></i> <strong>ფაკულტეტი:</strong> ${faculty}</p>
                            <p class="match-reason">ინოვაციური სწავლების მეთოდები და მჭიდრო კავშირები ბიზნეს სექტორთან.</p>
                            <div class="university-stats">
                                <div class="stat-item">
                                    <span class="stat-icon"><i class="fas fa-money-bill-wave"></i></span>
                                    <span class="stat-value">3,000-5,000 ლარი წელიწადში</span>
                                </div>
                                <div class="stat-item">
                                    <span class="stat-icon"><i class="fas fa-award"></i></span>
                                    <span class="stat-value">აქტიური სტუდენტებისთვის</span>
                                </div>
                            </div>
                            <div class="budget-info">
                                <p>${budgetText}</p>
                            </div>
                            <button class="more-info-btn"><i class="fas fa-info-circle"></i> მეტი ინფორმაცია</button>
                        </div>
                    </div>
                `;
            }
        }

        // Profession Recommendations
        async function getProfessionRecommendations(answers) {
            try {
                // Simulate API call delay
                await new Promise(resolve => setTimeout(resolve, 2000));
                
                const field = answers.q1;
                const careerGoals = answers.q5;
                
                if (field.includes('მეცნიერება') && careerGoals.includes('მეცნიერება')) {
                    return `
                        <div class="profession-card animate__animated animate__fadeIn">
                            <h5><i class="fas fa-flask"></i> მონაცემთა მეცნიერი</h5>
                            <p>მონაცემთა ანალიზი და მანქანური სწავლების მოდელების შემუშავება.</p>
                            <div class="reason">თქვენი ინტერესი მეცნიერების მიმართ და აკადემიური კარიერის სურვილი ეს პროფესია იდეალურად გახდის.</div>
                            <p class="salary"><i class="fas fa-money-bill-wave"></i> საშუალო ხელფასი: 4,000-8,000 ლარი</p>
                        </div>
                        <div class="profession-card animate__animated animate__fadeIn" style="animation-delay: 0.2s">
                            <h5><i class="fas fa-atom"></i> ბიოინფორმატიკოსი</h5>
                            <p>ბიოლოგიური მონაცემების კომპიუტერული ანალიზი.</p>
                            <div class="reason">კომბინირებს მეცნიერებასა და ტექნოლოგიებს, რაც თქვენს ინტერესებს შეესაბამება.</div>
                            <p class="salary"><i class="fas fa-money-bill-wave"></i> საშუალო ხელფასი: 3,500-7,000 ლარი</p>
                        </div>
                    `;
                } else if (field.includes('ბიზნესი') && careerGoals.includes('კორპორატიული')) {
                    return `
                        <div class="profession-card animate__animated animate__fadeIn">
                            <h5><i class="fas fa-chart-line"></i> ფინანსური ანალიტიკოსი</h5>
                            <p>კომპანიების ფინანსური მდგომარეობის ანალიზი და რეკომენდაციები.</p>
                            <div class="reason">თქვენი ინტერესი ბიზნესის მიმართ და კორპორატიული კარიერის სურვილი.</div>
                            <p class="salary"><i class="fas fa-money-bill-wave"></i> საშუალო ხელფასი: 3,000-6,000 ლარი</p>
                        </div>
                        <div class="profession-card animate__animated animate__fadeIn" style="animation-delay: 0.2s">
                            <h5><i class="fas fa-briefcase"></i> პროექტის მენეჯერი</h5>
                            <p>ბიზნეს პროექტების დაგეგმვა და მართვა.</p>
                            <div class="reason">კარგი არჩევანი ორგანიზებული ადამიანებისთვის, რომლებსაც სურთ კორპორატიულ კარიერაში წარმატება.</div>
                            <p class="salary"><i class="fas fa-money-bill-wave"></i> საშუალო ხელფასი: 3,500-7,000 ლარი</p>
                        </div>
                    `;
                } else {
                    // Default recommendations
                    return `
                        <div class="profession-card animate__animated animate__fadeIn">
                            <h5><i class="fas fa-laptop-code"></i> ვებ დეველოპერი</h5>
                            <p>ვებსაიტების და ვებ აპლიკაციების შემუშავება.</p>
                            <div class="reason">მოთხოვნადი პროფესია ტექნოლოგიურ სექტორში კარგი შემოსავლით.</div>
                            <p class="salary"><i class="fas fa-money-bill-wave"></i> საშუალო ხელფასი: 3,000-6,000 ლარი</p>
                        </div>
                        <div class="profession-card animate__animated animate__fadeIn" style="animation-delay: 0.2s">
                            <h5><i class="fas fa-paint-brush"></i> UX/UI დიზაინერი</h5>
                            <p>მომხმარებელზე ორიენტირებული ინტერფეისების დიზაინი.</p>
                            <div class="reason">კომბინირებს ტექნოლოგიებსა და შემოქმედებითობას, რაც ფართო აუდიტორიას იზიდავს.</div>
                            <p class="salary"><i class="fas fa-money-bill-wave"></i> საშუალო ხელფასი: 2,500-5,000 ლარი</p>
                        </div>
                        <div class="profession-card animate__animated animate__fadeIn" style="animation-delay: 0.4s">
                            <h5><i class="fas fa-globe"></i> ციფრული მარკეტინგის სპეციალისტი</h5>
                            <p>კომპანიების ონლაინ პრეზენციის მართვა და პრომოუშენი.</p>
                            <div class="reason">სწრაფად მზარდი სფერო მრავალფეროვანი შესაძლებლობებით.</div>
                            <p class="salary"><i class="fas fa-money-bill-wave"></i> საშუალო ხელფასი: 2,000-4,500 ლარი</p>
                        </div>
                    `;
                }
            } catch (error) {
                console.error('Error getting profession recommendations:', error);
                return `
                    <div class="profession-card">
                        <p>ვწუხვართ, პროფესიის რეკომენდაციების მიღებისას პრობლემა წარმოიშვა: ${error.message}</p>
                    </div>
                `;
            }
        }

        function getFaculty(interest) {
            if (interest.includes('მეცნიერება')) return 'ზუსტ და საბუნებისმეტყველო მეცნიერებათა ფაკულტეტი';
            if (interest.includes('ბიზნესი')) return 'ბიზნესისა და ეკონომიკის ფაკულტეტი';
            if (interest.includes('ხელოვნება')) return 'ჰუმანიტარული მეცნიერებების ფაკულტეტი';
            if (interest.includes('მედიცინა')) return 'სამედიცინო ფაკულტეტი';
            if (interest.includes('ინჟინერია')) return 'სამშენებლო ფაკულტეტი';
            return 'სოციალურ და პოლიტიკურ მეცნიერებათა ფაკულტეტი';
        }

        // Chat functionality
        function handleKeyPress(event) {
            if (event.key === 'Enter') {
                sendMessage();
            }
        }

        function sendMessage() {
            const message = userInput.value.trim();
            if (message === '') return;

            addMessage(message, 'user');
            userInput.value = '';

            showTypingIndicator();

            setTimeout(() => {
                removeTypingIndicator();
                const botResponse = generateChatResponse(message);
                addMessage(botResponse, 'bot');
                chatMessages.scrollTop = chatMessages.scrollHeight;
            }, 1500);
        }

        function addMessage(text, sender) {
            const messageDiv = document.createElement('div');
            messageDiv.className = `message ${sender}-message animate__animated animate__fadeIn`;
            
            const contentDiv = document.createElement('div');
            contentDiv.className = 'message-content';
            contentDiv.textContent = text;
            
            messageDiv.appendChild(contentDiv);
            chatMessages.appendChild(messageDiv);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }

        function showTypingIndicator() {
            const typingDiv = document.createElement('div');
            typingDiv.className = 'message bot-message';
            typingDiv.id = 'typingIndicator';
            
            const contentDiv = document.createElement('div');
            contentDiv.className = 'typing-indicator';
            contentDiv.innerHTML = '<span></span><span></span><span></span>';
            
            typingDiv.appendChild(contentDiv);
            chatMessages.appendChild(typingDiv);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }

        function removeTypingIndicator() {
            const typingIndicator = document.getElementById('typingIndicator');
            if (typingIndicator) {
                typingIndicator.remove();
            }
        }

        function generateChatResponse(userMessage) {
            const lowerMessage = userMessage.toLowerCase();
            
            if (lowerMessage.includes('შეღავათი') || lowerMessage.includes('სტიპენდია')) {
                return "სტიპენდიების მიღება შესაძლებელია საქართველოს უმეტეს უნივერსიტეტში. სახელმწიფო უნივერსიტეტებში ხშირად არის მეტი სტიპენდიის შესაძლებლობა, ხოლო კერძო უნივერსიტეტებში - სასწავლო გრანტები და ფასდაკლებები.";
            } 
            else if (lowerMessage.includes('ფასი') || lowerMessage.includes('საფასური')) {
                return "საფასური საქართველოში: სახელმწიფო უნივერსიტეტები - 1,500-5,000 ლარი წელიწადში; კერძო უნივერსიტეტები - 3,000-15,000 ლარი წელიწადში. ზუსტი ფასი დამოკიდებულია პროგრამაზე.";
            }
            else if (lowerMessage.includes('მისაღები') || lowerMessage.includes('შეფასება')) {
                return "სახელმწიფო უნივერსიტეტებში მისაღებია ეროვნული გამოცდების ქულები. კერძო უნივერსიტეტებში ხშირად ატარებენ საკუთარ გამოცდებს ან იღებენ მოსწავლეებს საშუალო ქულების მიხედვით.";
            }
            else if (lowerMessage.includes('დასაქმება') || lowerMessage.includes('კარიერა')) {
                return "როგორც სახელმწიფო, ასევე კერძო უნივერსიტეტების დიპლომი აღიარებულია საქართველოში. კერძო უნივერსიტეტებს ხშირად აქვთ უფრო მჭიდრო კავშირები კომპანიებთან.";
            }
            else if (lowerMessage.includes('პროფესია') || lowerMessage.includes('კარიერა')) {
                return "თქვენი პროფესიის არჩევანი დამოკიდებულია თქვენს ინტერესებზე, უნარებზე და კარიერულ მიზნებზე. შეგიძლიათ გაიაროთ ჩვენი ტესტი პერსონალიზებული რეკომენდაციების მისაღებად.";
            }
            else {
                return "გთხოვთ, დაწვრილებით აღწერეთ თქვენი კითხვა. შემიძლია დაგეხმაროთ შემდეგ თემებზე: 1) სტიპენდიები, 2) საფასური, 3) მისაღები გამოცდები, 4) დასაქმების შესაძლებლობები, 5) პროფესიების არჩევანი.";
            }
        }

        // Make functions available globally
        window.selectOption = selectOption;
        window.prevQuestion = prevQuestion;
        window.nextQuestion = nextQuestion;
        window.submitQuestionnaire = submitQuestionnaire;
        window.handleKeyPress = handleKeyPress;
        window.sendMessage = sendMessage;