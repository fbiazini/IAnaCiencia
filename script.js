/* Arquivo de script consolidado para o "Guia de IA para a Ciência".
    Contém toda a lógica extraída dos 7 arquivos HTML.
*/

document.addEventListener('DOMContentLoaded', function () {
    
    // ======================================================
    // 1. LÓGICA COMUM (Executada em todas as 7 páginas)
    // Aplica classes de estilo base aos botões de navegação
    // ======================================================
    const navButtons = document.querySelectorAll('.nav-btn');
    if (navButtons.length > 0) {
        navButtons.forEach(btn => {
            btn.classList.add('px-5', 'py-2', 'rounded-full', 'text-sm', 'font-medium', 'transition-all', 'duration-300', 'transform', 'bg-white', 'text-slate-700', 'border', 'border-slate-200', 'shadow-sm', 'hover:bg-slate-100', 'hover:scale-105');
        });
    }

    // ======================================================
    // 2. LÓGICA ESPECÍFICA (Página: principios.html)
    // Acordeão que fecha os outros itens ao abrir um.
    // ======================================================
    const accordionEthics = document.getElementById('accordion-ethics');
    if (accordionEthics) {
        // ... (código inalterado para acordeão de princípios) ...
// ... (existing code for accordion) ...
        const headers = accordionEthics.querySelectorAll('.accordion-header');
        headers.forEach(header => {
            header.addEventListener('click', () => {
                const content = header.nextElementSibling;
                const isOpen = !content.classList.contains('hidden');
                
                // Fecha todos os outros para manter a interface limpa
                header.closest('#accordion-ethics').querySelectorAll('.accordion-content').forEach(c => c.classList.add('hidden'));
                header.closest('#accordion-ethics').querySelectorAll('.accordion-header').forEach(h => h.classList.remove('open'));
                
                if (isOpen) {
                    // Se estava aberto, o loop acima já o fechou.
                } else {
                    // Se estava fechado, abre.
                    content.classList.remove('hidden');
                    header.classList.add('open');
                }
            });
        });
    }

    // ======================================================
    // 3. LÓGICA ESPECÍFICA (Página: fluxo.html)
    // Stepper interativo do fluxo de trabalho.
    // ======================================================
    const stepButtonsContainer = document.getElementById('step-buttons');
    if (stepButtonsContainer) {
        // ... (código inalterado para stepper de fluxo) ...
// ... (existing code for stepper) ...
        const stepButtons = stepButtonsContainer.querySelectorAll('.step-btn-infographic');
        const stepContents = document.querySelectorAll('#step-content-wrapper .step-content');

        stepButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Botões
                stepButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                
                // Conteúdo
                const targetStepId = button.getAttribute('data-step');
                stepContents.forEach(content => {
                    if (content.id === targetStepId) {
                        content.classList.remove('hidden');
                    } else {
                        content.classList.add('hidden');
                    }
                });
            });
        });
    }

    // ======================================================
    // 4. LÓGICA ESPECÍFICA (Página: analise.html)
    // Acordeão que permite múltiplos itens abertos.
    // ======================================================
    const analysisPage = document.getElementById('page-analysis');
    if (analysisPage) {
        // ... (código inalterado para acordeão de análise) ...
// ... (existing code for accordion) ...
        // Seleciona acordeões *apenas* dentro da página de análise
        const analysisAccordions = analysisPage.querySelectorAll('.accordion-header');
        
        analysisAccordions.forEach(header => {
            header.addEventListener('click', () => {
                const content = header.nextElementSibling;
                const isOpen = !content.classList.contains('hidden');
                
                // Esta versão não fecha os outros acordeões
                if (isOpen) {
                    content.classList.add('hidden');
                    header.classList.remove('open');
                } else {
                    content.classList.remove('hidden');
                    header.classList.add('open');
                }
            });
        });
    }

    // ======================================================
    // 5. LÓGICA ESPECÍFICA (Página: catalogo.html)
    // Inclui Gráfico, Filtros e Modal com sua base de dados.
    // ======================================================

    // --- 5.1. Lógica do Gráfico (Chart.js) ---
    const toolsChartCanvas = document.getElementById('toolsChart');
    if (toolsChartCanvas) {
        // ... (código inalterado para o gráfico) ...
// ... (existing code for chart) ...
        const ctx = toolsChartCanvas.getContext('2d');
        const toolData = {
            labels: [
                'Escrita e Edição (19)',     // ✍️
                'Busca e Revisão (11)',      // 🔎
                'LLMs (9)',                  // 🧠
                'Programação (5)',           // 💻
                'Análise de Dados (4)',      // 📊
                'Imagem (3)'                 // 🖼️
            ],
            datasets: [{
                label: 'Número de Ferramentas',
                data: [19, 11, 9, 5, 4, 3], // Ordem dos labels
                backgroundColor: [
                    '#f97316', // orange-500 (Escrita)
                    '#3b82f6', // blue-500 (Busca)
                    '#8b5cf6', // violet-500 (LLMs)
                    '#334155', // slate-700 (Programação)
                    '#10b981', // emerald-500 (Análise)
                    '#ef4444', // red-500 (Imagem)
                ],
                borderColor: '#f8fafc', // slate-50
                borderWidth: 3,
                hoverOffset: 8
            }]
        };

        new Chart(ctx, {
            type: 'doughnut',
            data: toolData,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 15,
                            font: { size: 12, family: 'sans-serif' },
                            color: '#334155' // slate-700
                        }
                    },
                    tooltip: {
                        enabled: true,
                        backgroundColor: '#1e293b', // slate-800
                        titleColor: '#ffffff',
                        bodyColor: '#ffffff',
                        cornerRadius: 8,
                        displayColors: true,
                        callbacks: {
                            label: function(context) {
                                let label = context.label || '';
                                if (label) {
                                    label = label.split('(')[0].trim();
                                }
                                const value = context.raw || 0;
                                return ` ${label}: ${value} ferramentas`;
                            }
                        }
                    }
                }
            }
        });
    }

    // --- [INÍCIO DA NOVA LÓGICA 5.2 e 5.3] ---
    // Lógica dinâmica para Filtro e Modal (lendo de ferramentas.json)

    // Garante que a lógica só rode na página do catálogo
    const toolsGridEl = document.getElementById('tools-grid');
    const toolModal = document.getElementById('tool-modal');

    if (toolsGridEl && toolModal) {
        
        let allToolsData = [];
        const filterButtons = document.querySelectorAll('.filter-btn');
        
        // --- Elementos do Modal ---
        const modalCloseBtn = document.getElementById('modal-close');
        const modalTitle = document.getElementById('modal-title');
        const modalPricing = document.getElementById('modal-pricing');
        const modalStudent = document.getElementById('modal-student');
        const modalReview = document.getElementById('modal-review');
        const modalLink = document.getElementById('modal-link');

        // --- Funções do Modal ---
        const closeModal = () => toolModal.classList.add('hidden');
        
        const openModal = (toolId) => {
            const tool = allToolsData.find(t => t.id === toolId);
            if (!tool) {
                console.error(`Tool with id ${toolId} not found.`);
                return;
            }
            
            modalTitle.textContent = tool.nome;
            modalPricing.textContent = tool.detalhes.pricing;
            modalStudent.textContent = tool.detalhes.studentPlan;
            // Adiciona aspas se não existirem na resenha
            modalReview.textContent = tool.detalhes.review.startsWith('"') ? tool.detalhes.review : `"${tool.detalhes.review}"`;
            modalLink.setAttribute('href', tool.detalhes.link);
            toolModal.classList.remove('hidden');
        };

        // --- Função de Renderização de Cards ---
        const renderToolCards = (tools) => {
            toolsGridEl.innerHTML = ''; // Limpa o grid

            if (tools.length === 0) {
                toolsGridEl.innerHTML = '<p class="text-slate-500 col-span-3 text-center">Nenhuma ferramenta encontrada para esta categoria.</p>';
                return;
            }

            tools.forEach(tool => {
                const cardHTML = `
                <div class="tool-card" data-category="${tool.categoria.join(' ')}">
                    <div class="flex justify-end items-center mb-4 h-16">
                        <span class="text-4xl flex gap-2" title="${tool.categoria.join(', ')}">${tool.emojis}</span>
                    </div>
                    <h4 class="font-semibold text-lg text-teal-700 mb-2">${tool.nome}</h4>
                    <p class="text-sm text-slate-600 flex-grow mb-4">${tool.descricao}</p>
                    <button classa="modal-trigger block w-full text-center bg-teal-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-teal-700 transition-colors mt-auto" data-tool-id="${tool.id}">Ver Detalhes</button>
                </div>
                `;
                toolsGridEl.innerHTML += cardHTML;
            });

            // Adiciona classes de estilo base aos cards (que antes estavam em 5.2)
            toolsGridEl.querySelectorAll('.tool-card').forEach(card => {
                card.classList.add('p-6', 'bg-white', 'rounded-3xl', 'shadow-xl', 'border', 'border-slate-200', 'transition-all', 'duration-300', 'hover:shadow-2xl', 'hover:-translate-y-1', 'flex', 'flex-col');
            });
            
            // Re-anexa os listeners do modal aos botões recém-criados
            toolsGridEl.querySelectorAll('.modal-trigger').forEach(trigger => {
                trigger.addEventListener('click', (e) => {
                    e.preventDefault();
                    openModal(trigger.getAttribute('data-tool-id'));
                });
            });
        };

        // --- Configuração dos Filtros ---
        filterButtons.forEach(button => {
            // Adiciona classes de estilo base aos botões (que antes estavam em 5.2)
            button.classList.add('px-4', 'py-2', 'text-sm', 'font-medium', 'rounded-full', 'transition-all', 'duration-300', 'transform', 'bg-slate-100', 'text-slate-700', 'hover:bg-slate-200', 'hover:scale-105');
            
            button.addEventListener('click', () => {
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                const filter = button.getAttribute('data-filter');
                
                const filteredTools = (filter === 'all')
                    ? allToolsData
                    : allToolsData.filter(tool => tool.categoria.includes(filter));
                    
                renderToolCards(filteredTools);
            });
        });

        // --- Fetch inicial dos dados ---
        fetch('ferramentas.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                allToolsData = data;
                // Ordena os dados em ordem alfabética por 'nome'
                allToolsData.sort((a, b) => a.nome.localeCompare(b.nome));
                renderToolCards(allToolsData); // Renderiza todos os cards
            })
            .catch(error => {
                console.error('Erro ao carregar ferramentas.json:', error);
                toolsGridEl.innerHTML = '<p class="text-red-600 col-span-3 text-center">Ocorreu um erro ao carregar o catálogo de ferramentas. Verifique o console.</p>';
            });
        
        // Anexa listeners de fechamento do modal (só precisa ser feito uma vez)
        if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
        toolModal.addEventListener('click', (e) => {
            if (e.target === toolModal) closeModal();
        });
    }
    // --- [FIM DA NOVA LÓGICA] ---

}); // Fim do DOMContentLoaded