// Boas práticas: encapsular a lógica em um objeto ou módulo.
const App = {
    // Seleção de elementos da DOM
    elements: {
        loginContainer: document.getElementById('login-container'),
        dashboardContainer: document.getElementById('dashboard-container'),
        loginForm: document.getElementById('login-form'),
        logoutBtn: document.getElementById('logout-btn'),
        userEmailSpan: document.getElementById('user-email'),
        emailInput: document.getElementById('email'),
        passwordInput: document.getElementById('password'),
        chartCanvas: document.getElementById('performanceChart'),
    },

    // Ponto de entrada da aplicação
    init() {
        this.addEventListeners();
        this.checkSession();
    },

    // Gerencia todos os listeners de eventos
    addEventListeners() {
        this.elements.loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin();
        });

        this.elements.logoutBtn.addEventListener('click', () => {
            this.handleLogout();
        });
    },

    // Verifica se existe uma sessão ativa no localStorage
    checkSession() {
        const loggedInUser = localStorage.getItem('loggedInUser');
        if (loggedInUser) {
            this.showDashboard(loggedInUser);
        } else {
            this.showLogin();
        }
    },

    // Lida com a submissão do formulário de login
    handleLogin() {
        const email = this.elements.emailInput.value;
        const password = this.elements.passwordInput.value;

        // VALIDAÇÃO: Simples, mas funcional para o protótipo.
        // No mundo real, aqui ocorreria a chamada para a API.
        if (email && password) {
            console.log(`Tentativa de login com: ${email}`);
            
            // Simulação de sucesso: salvamos o email do usuário como "token" de sessão
            localStorage.setItem('loggedInUser', email);
            this.showDashboard(email);

        } else {
            alert('Por favor, preencha o email e a senha.');
        }
    },

    // Lida com o logout do usuário
    handleLogout() {
        console.log('Sessão encerrada.');
        localStorage.removeItem('loggedInUser'); // Chave para a persistência!
        this.showLogin();
    },

    // Mostra a tela de dashboard
    showDashboard(email) {
        this.elements.loginContainer.classList.add('hidden');
        this.elements.dashboardContainer.classList.remove('hidden');
        
        // Atualiza o email do usuário no cabeçalho
        this.elements.userEmailSpan.textContent = `Olá, ${email}`;

        // Renderiza o gráfico
        this.renderPerformanceChart();
    },

    // Mostra a tela de login
    showLogin() {
        this.elements.dashboardContainer.classList.add('hidden');
        this.elements.loginContainer.classList.remove('hidden');
        
        // Limpa o gráfico se ele existir, para não manter dados antigos em memória
        if (window.myChart) {
            window.myChart.destroy();
        }
    },

    // Renderiza o gráfico com Chart.js
    renderPerformanceChart() {
        const ctx = this.elements.chartCanvas.getContext('2d');
        
        // Destrói uma instância anterior do gráfico para evitar bugs de renderização
        if (window.myChart instanceof Chart) {
            window.myChart.destroy();
        }

        window.myChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Semana 1', 'Semana 2', 'Semana 3', 'Semana 4', 'Semana 5', 'Semana 6'],
                datasets: [{
                    label: 'Investimento (R$)',
                    data: [2200, 3100, 2800, 4200, 3500, 4500],
                    borderColor: 'rgba(238, 77, 45, 1)',
                    backgroundColor: 'rgba(238, 77, 45, 0.1)',
                    tension: 0.3,
                    fill: true,
                }, {
                    label: 'Conversões',
                    data: [40, 62, 55, 90, 75, 110],
                    borderColor: 'rgba(0, 95, 156, 1)',
                    backgroundColor: 'rgba(0, 95, 156, 0.1)',
                    tension: 0.3,
                    fill: true,
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false, // ESSENCIAL para o gráfico se adaptar ao container
                scales: {
                    y: { beginAtZero: true }
                },
                plugins: {
                    legend: { position: 'top' },
                    tooltip: { mode: 'index', intersect: false }
                }
            }
        });
    }
};

// Dispara a aplicação quando o DOM está pronto.
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});