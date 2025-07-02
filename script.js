const App = {
    elements: {
        loginContainer: document.getElementById('login-container'),
        dashboardContainer: document.getElementById('dashboard-container'),
        loadingOverlay: document.getElementById('loading-overlay'),
        loginForm: document.getElementById('login-form'),
        logoutBtn: document.getElementById('logout-btn'),
        fetchDataBtn: document.getElementById('fetch-data-btn'),
        userEmailSidebar: document.getElementById('user-email-sidebar'),
        emailInput: document.getElementById('email'),
        passwordInput: document.getElementById('password'),
        startDateInput: document.getElementById('start-date'),
        endDateInput: document.getElementById('end-date'),
        chartCanvas: document.getElementById('performanceChart'),
        kpis: {
            investimento: document.getElementById('kpi-investimento'),
            impressoes: document.getElementById('kpi-impressoes'),
            cliques: document.getElementById('kpi-cliques'),
            ctr: document.getElementById('kpi-ctr'),
        }
    },

    init() {
        this.addEventListeners();
        this.setDefaultDates();
        this.checkSession();
    },

    addEventListeners() {
        this.elements.loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin();
        });

        this.elements.logoutBtn.addEventListener('click', () => this.handleLogout());
        this.elements.fetchDataBtn.addEventListener('click', () => this.handleDataFetch());
    },
    
    setDefaultDates() {
        const today = new Date();
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(today.getDate() - 30);
        
        this.elements.endDateInput.value = today.toISOString().split('T')[0];
        this.elements.startDateInput.value = thirtyDaysAgo.toISOString().split('T')[0];
    },

    checkSession() {
        const loggedInUser = localStorage.getItem('loggedInUser');
        if (loggedInUser) {
            this.showDashboard(loggedInUser);
        } else {
            this.showLogin();
        }
    },

    handleLogin() {
        const email = this.elements.emailInput.value;
        const password = this.elements.passwordInput.value;

        if (email && password) {
            localStorage.setItem('loggedInUser', email);
            this.showDashboard(email);
        } else {
            alert('Por favor, preencha o email e a senha.');
        }
    },

    handleLogout() {
        console.log('Sessão encerrada.');
        localStorage.removeItem('loggedInUser');
        this.showLogin();
    },

    handleDataFetch() {
        const startDate = this.elements.startDateInput.value;
        const endDate = this.elements.endDateInput.value;
        
        if (!startDate || !endDate) {
            alert("Por favor, selecione um período de datas.");
            return;
        }

        console.log(`Buscando dados de ${startDate} até ${endDate}...`);
        this.setLoading(true);

        // Simula uma chamada de API com 1.5 segundos de atraso
        setTimeout(() => {
            // ****** AQUI ESTÁ A CORREÇÃO PRINCIPAL ******
            try {
                // Código que pode falhar fica no bloco 'try'
                this.updateDashboardData();
                console.log("Dados atualizados com sucesso!");
            } catch (error) {
                // Se um erro ocorrer, ele é capturado aqui
                console.error("Falha ao atualizar o dashboard:", error);
                alert("Ocorreu um erro ao buscar os dados. Por favor, tente novamente.");
            } finally {
                // O bloco 'finally' executa SEMPRE, garantindo que o spinner seja escondido
                this.setLoading(false);
            }
        }, 1500);
    },

    showDashboard(email) {
        this.elements.loginContainer.classList.add('hidden');
        this.elements.dashboardContainer.classList.remove('hidden');
        this.elements.userEmailSidebar.textContent = email;
        const avatar = this.elements.dashboardContainer.querySelector('.profile-avatar');
        avatar.textContent = email.charAt(0).toUpperCase();

        this.updateDashboardData();
    },

    showLogin() {
        this.elements.dashboardContainer.classList.add('hidden');
        this.elements.loginContainer.classList.remove('hidden');
        
        // Boa prática: destruir o gráfico ao sair para liberar memória
        if (window.myChart) {
            window.myChart.destroy();
            window.myChart = null; 
        }
    },
    
    setLoading(isLoading) {
        this.elements.loadingOverlay.classList.toggle('hidden', !isLoading);
    },

    updateDashboardData() {
        const randomData = {
            investimento: (Math.random() * 20000 + 5000),
            impressoes: Math.floor(Math.random() * 2000000 + 1000000),
            cliques: Math.floor(Math.random() * 50000 + 10000),
        };
        randomData.ctr = (randomData.cliques / randomData.impressoes) * 100;
        
        this.elements.kpis.investimento.innerHTML = `<h4>Investimento Total</h4><p>${randomData.investimento.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}</p><span class="kpi-change positive">+${(Math.random()*10).toFixed(1)}%</span>`;
        this.elements.kpis.impressoes.innerHTML = `<h4>Impressões</h4><p>${(randomData.impressoes/1000000).toFixed(1)}M</p><span class="kpi-change positive">+${(Math.random()*10).toFixed(1)}%</span>`;
        this.elements.kpis.cliques.innerHTML = `<h4>Cliques</h4><p>${randomData.cliques.toLocaleString('pt-BR')}</p><span class="kpi-change negative">-${(Math.random()*5).toFixed(1)}%</span>`;
        this.elements.kpis.ctr.innerHTML = `<h4>CTR (Taxa de Clique)</h4><p>${randomData.ctr.toFixed(2)}%</p><span class="kpi-change positive">+${(Math.random()).toFixed(2)}%</span>`;

        this.renderPerformanceChart();
    },

    renderPerformanceChart() {
        const ctx = this.elements.chartCanvas.getContext('2d');
        const labels = ['Semana 1', 'Semana 2', 'Semana 3', 'Semana 4', 'Semana 5', 'Semana 6'];
        
        const chartData = {
            labels: labels,
            datasets: [{
                label: 'Investimento (R$)',
                data: labels.map(() => Math.random() * 5000 + 1000),
                borderColor: 'rgba(238, 77, 45, 1)',
                backgroundColor: 'rgba(238, 77, 45, 0.1)',
                tension: 0.3,
                fill: true,
            }, {
                label: 'Conversões',
                data: labels.map(() => Math.random() * 150 + 20),
                borderColor: 'rgba(0, 95, 156, 1)',
                backgroundColor: 'rgba(0, 95, 156, 0.1)',
                tension: 0.3,
                fill: true,
            }]
        };

        if (window.myChart) {
            window.myChart.data = chartData;
            window.myChart.update();
        } else {
            window.myChart = new Chart(ctx, {
                type: 'line',
                data: chartData,
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: { y: { beginAtZero: true } },
                    plugins: { legend: { position: 'top' }, tooltip: { mode: 'index', intersect: false } }
                }
            });
        }
    }
};

document.addEventListener('DOMContentLoaded', () => {
    App.init();
});