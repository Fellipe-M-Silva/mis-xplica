document.addEventListener("DOMContentLoaded", () => {
	const body = document.body;

	//
	// Dinâmicos
	//

	// Função para mudar o texto do botão ao passar o mouse
	const hoverButton = document.getElementById("hover-button");
	hoverButton.addEventListener("mouseover", () => {
		hoverButton.textContent = "Você passou o mouse!";
	});
	// Função para restaurar o texto do botão ao sair o mouse
	hoverButton.addEventListener("mouseout", () => {
		hoverButton.textContent = "Passe o mouse aqui";
	});

	// Função para alternar o estado do toggle
	const toggleButton = document.getElementById("toggle-button");
	const toggleStatus = document.getElementById("toggle-status");
	toggleButton.addEventListener("change", () => {
		if (toggleButton.checked) {
			toggleStatus.textContent = "Ativado";
			body.classList.add("toggle-active");
		} else {
			toggleStatus.textContent = "Desativado";
			body.classList.remove("toggle-active");
		}
	});
	// Função para alternar o estado do toggle visualmente
	const toggleIndicator = document.getElementById("toggle-indicator");
	toggleIndicator.addEventListener("click", () => {
		if (toggleIndicator.classList.contains("active")) {
			toggleIndicator.classList.remove("active");
			toggleStatus.textContent = "Desativado";
			body.classList.remove("toggle-active");
		} else {
			toggleIndicator.classList.add("active");
			toggleStatus.textContent = "Ativado";
			body.classList.add("toggle-active");
		}
	});

	// Função para atualizar o texto do select ao selecionar uma opção
	const selectField = document.getElementById("select-field");
	const selectedOption = document.getElementById("selected-option");
	selectField.addEventListener("change", () => {
		if (selectField.value) {
			const selectedValue =
				selectField.options[selectField.selectedIndex].text;
			selectedOption.textContent = `Opção selecionada: ${selectedValue}`;
		} else {
			selectedOption.textContent = "Opção selecionada: nenhuma";
		}
	});

	// Função para mover o objeto dentro da área
	const movableArea = document.getElementById("movable-area");
	const movableObject = document.getElementById("movable-object");
	movableArea.addEventListener("mousedown", (event) => {
		if (event.target === movableObject) {
			const offsetX =
				event.clientX - movableObject.getBoundingClientRect().left;
			const offsetY =
				event.clientY - movableObject.getBoundingClientRect().top;

			const moveAt = (pageX, pageY) => {
				movableObject.style.left = `${pageX - offsetX}px`;
				movableObject.style.top = `${pageY - offsetY}px`;
			};

			const onMouseMove = (event) => {
				moveAt(event.pageX, event.pageY);
			};

			document.addEventListener("mousemove", onMouseMove);

			document.addEventListener(
				"mouseup",
				() => {
					document.removeEventListener("mousemove", onMouseMove);
				},
				{ once: true }
			);
		}
	});
	// Função para mover o objeto dentro da área com touch
	movableArea.addEventListener("touchstart", (event) => {
		if (event.target === movableObject) {
			const touch = event.touches[0];
			const offsetX =
				touch.clientX - movableObject.getBoundingClientRect().left;
			const offsetY =
				touch.clientY - movableObject.getBoundingClientRect().top;

			const moveAt = (pageX, pageY) => {
				movableObject.style.left = `${pageX - offsetX}px`;
				movableObject.style.top = `${pageY - offsetY}px`;
			};

			const onTouchMove = (event) => {
				moveAt(event.touches[0].pageX, event.touches[0].pageY);
			};

			document.addEventListener("touchmove", onTouchMove);

			document.addEventListener(
				"touchend",
				() => {
					document.removeEventListener("touchmove", onTouchMove);
				},
				{ once: true }
			);
		}
	});

	// Função para voltar ao topo da página
	const backToTopButton = document.getElementById("back-to-top");
	const backToExampleButton = document.getElementById("back-to-example");
	const exampleSection = document.getElementById("example-section");
	backToTopButton.addEventListener("click", () => {
		window.scrollTo({
			top: 0,
			behavior: "smooth",
		});
		backToExampleButton.classList.add("active"); // Mostra o botão para voltar ao exemplo
	});
	// Função para voltar ao exemplo. o botão só aparece quando o usuário clica no exemplo
	backToExampleButton.addEventListener("click", () => {
		window.scrollTo({
			top: exampleSection.offsetTop,
			behavior: "smooth",
		});
		backToExampleButton.classList.remove("active"); // Esconde o botão após voltar
	});

	//
	// Metalinguísticos
	//

	// Função para abrir tooltips ao passar o mouse no botão
	const tooltipButton = document.getElementById("tooltip-button");
	const tooltipContent = document.getElementById("tooltip-content");

	if (tooltipButton && tooltipContent) {
		tooltipButton.addEventListener("mouseover", () => {
			tooltipContent.classList.add("active");
		});

		tooltipButton.addEventListener("mouseout", () => {
			tooltipContent.classList.remove("active");
		});
	} else {
		console.warn(
			"Elemento tooltip-button ou tooltip-content não encontrado. Verifique o ID no HTML."
		);
	}

	// Função para abrir o diálogo ao clicar no botão
	const dialogButton = document.getElementById("dialog-button");
	const dialogButtonDialog = document.getElementById("dialog-button-dialog");
	const closeDialogButton = document.getElementById("close-dialog-button");

	if (dialogButton && dialogButtonDialog) {
		dialogButton.addEventListener("click", () => {
			console.log("Abrindo diálogo...");
			dialogButtonDialog.classList.add("active");
		});
	} else {
		console.warn(
			"Elemento dialog-button ou dialog-button-dialog não encontrado. Verifique o ID no HTML."
		);
	}

	// Função para fechar o diálogo ao clicar no botão de fechar ou fora do diálogo
	if (closeDialogButton && dialogButtonDialog) {
		closeDialogButton.addEventListener("click", () => {
			dialogButtonDialog.classList.remove("active");
		});

		dialogButtonDialog.addEventListener("click", (event) => {
			if (event.target === dialogButtonDialog) {
				dialogButtonDialog.classList.remove("active");
			}
		});
	} else {
		console.warn(
			"Elemento close-dialog-button ou dialog-button-dialog não encontrado. Verifique o ID no HTML."
		);
	}

	// Função para fechar o diálogo ao pressionar a tecla Escape
	document.addEventListener("keydown", (event) => {
		if (event.key === "Escape") {
			dialogButtonDialog.classList.remove("active");
		}
	});

	// Função pra alterar o helper de senha
	const passwordField = document.getElementById("password-field");
	const passwordFieldHelper = document.getElementById(
		"password-field-helper"
	);
	if (passwordField && passwordFieldHelper) {
		passwordField.addEventListener("blur", () => {
			const value = passwordField.value;
			if (value === "") {
				passwordFieldHelper.textContent = "Campo obrigatório.";
				passwordFieldHelper.style.color = "red";
			} else if (value.length < 3 || value.length > 20) {
				passwordFieldHelper.textContent =
					"Senha inválida. Deve conter entre 3 e 20 caracteres.";
				passwordFieldHelper.style.color = "red";
			} else {
				passwordFieldHelper.textContent = "Senha válida.";
				passwordFieldHelper.style.color = "green";
			}
		});
	} else {
		console.warn(
			"Elemento password-field ou password-field-helper não encontrado. Verifique o ID no HTML."
		);
	}

	// Função para copiar o link do site
	const copyButton = document.getElementById("copy-button");
	copyButton.addEventListener("click", () => {
		navigator.clipboard.writeText(window.location.href).then(() => {
			alert(
				"Este alert é um exemplo de signo metalinguístico. Link copiado para a área de transferência!"
			);
		});
	});

	// Seleção dos novos elementos do diálogo de feedback
	const feedbackDialogOverlay = document.getElementById(
		"feedback-dialog-overlay"
	);
	const feedbackDialogTitle = document.getElementById(
		"feedback-dialog-title"
	);
	const feedbackDialogMessage = document.getElementById(
		"feedback-dialog-message"
	);
	const closeFeedbackDialogButton = document.getElementById(
		"close-feedback-dialog-button"
	);
	const feedbackForm = document.getElementById("feedback-form");
	const ratingStarsContainer = document.getElementById(
		"feedback-rating-stars"
	);
	const ratingStars = ratingStarsContainer
		? ratingStarsContainer.querySelectorAll(".star")
		: [];
	const feedbackRatingInput = document.getElementById("feedback-rating");
	const feedbackTextInput = document.getElementById("feedback-text");

	// --- FEEDBACK DIALOG LOGIC ---
	const likeButton = document.getElementById("like-button");
	const dislikeButton = document.getElementById("dislike-button");
	const likeCountSpan = document.getElementById("like-count"); // This needs to be in HTML!

	const localStorageFeedbackStatusKey = "misXplica_page_feedback_status";
	const localStorageRatingKey = "misXplica_page_rating";
	const localStorageCommentKey = "misXplica_page_comment";

	// Function to open the feedback dialog
	const openFeedbackDialog = (title, message) => {
		if (feedbackDialogOverlay) {
			// Check if element exists
			feedbackDialogTitle.textContent = title;
			feedbackDialogMessage.textContent = message;
			feedbackDialogOverlay.classList.add("active");
			body.classList.add("no-scroll");
			loadSavedFeedback(); // Load existing feedback when dialog opens
		} else {
			console.warn(
				"Feedback dialog elements not found. Cannot open dialog."
			);
		}
	};

	// Function to close the feedback dialog
	const closeFeedbackDialog = () => {
		if (feedbackDialogOverlay) {
			// Check if element exists
			feedbackDialogOverlay.classList.remove("active");
			body.classList.remove("no-scroll");
			resetFeedbackForm(); // Reset form on close
		}
	};

	const loadSavedFeedback = () => {
		const savedRating = localStorage.getItem(localStorageRatingKey);
		const savedComment = localStorage.getItem(localStorageCommentKey);

		if (savedRating && feedbackRatingInput) {
			updateStarRating(parseInt(savedRating, 10));
		} else if (feedbackRatingInput) {
			updateStarRating(0);
		}

		if (savedComment && feedbackTextInput) {
			feedbackTextInput.value = savedComment;
		} else if (feedbackTextInput) {
			feedbackTextInput.value = "";
		}
	};

	const resetFeedbackForm = () => {
		if (feedbackRatingInput) updateStarRating(0);
		if (feedbackTextInput) feedbackTextInput.value = "";
		if (feedbackRatingInput) feedbackRatingInput.value = "0";
	};

	const updateStarRating = (selectedRating) => {
		if (feedbackRatingInput) feedbackRatingInput.value = selectedRating;
		ratingStars.forEach((star) => {
			if (parseInt(star.dataset.rating) <= selectedRating) {
				star.classList.add("filled");
			} else {
				star.classList.remove("filled");
			}
		});
	};

	// Star rating event listeners
	if (ratingStarsContainer) {
		ratingStarsContainer.addEventListener("mouseover", (event) => {
			if (event.target.classList.contains("star")) {
				const hoverRating = parseInt(event.target.dataset.rating);
				ratingStars.forEach((star) => {
					if (parseInt(star.dataset.rating) <= hoverRating) {
						star.classList.add("filled");
					} else {
						star.classList.remove("filled");
					}
				});
			}
		});
		ratingStarsContainer.addEventListener("mouseout", () => {
			updateStarRating(parseInt(feedbackRatingInput.value || "0"));
		});
		ratingStarsContainer.addEventListener("click", (event) => {
			if (event.target.classList.contains("star")) {
				const clickedRating = parseInt(event.target.dataset.rating);
				updateStarRating(clickedRating);
				localStorage.setItem(
					localStorageRatingKey,
					clickedRating.toString()
				);
			}
		});
	}

	const updateVoteUI = () => {
		const userFeedbackStatus = localStorage.getItem(
			localStorageFeedbackStatusKey
		);
		if (likeButton) likeButton.classList.remove("liked");
		if (dislikeButton) dislikeButton.classList.remove("disliked");
		// Only update likeCountSpan if it exists
		if (likeCountSpan) likeCountSpan.textContent = "0";

		if (userFeedbackStatus === "liked") {
			if (likeButton) likeButton.classList.add("liked");
			if (likeCountSpan) likeCountSpan.textContent = "1";
		} else if (userFeedbackStatus === "disliked") {
			if (dislikeButton) dislikeButton.classList.add("disliked");
		}
	};

	if (likeButton && dislikeButton) {
		// Ensure buttons exist before adding listeners
		updateVoteUI(); // Initial UI update
		likeButton.addEventListener("click", () => {
			const currentStatus = localStorage.getItem(
				localStorageFeedbackStatusKey
			);
			let dialogTitle = "Obrigado!";
			let dialogMessage = "Obrigado por curtir esta página!";
			if (currentStatus === "liked") {
				localStorage.setItem(localStorageFeedbackStatusKey, "none");
				dialogTitle = "Curtida Removida";
				dialogMessage =
					"Sua curtida foi removida. Esperamos que mude de ideia!";
			} else {
				localStorage.setItem(localStorageFeedbackStatusKey, "liked");
				if (dislikeButton) dislikeButton.classList.remove("disliked");
			}
			updateVoteUI();
			openFeedbackDialog(dialogTitle, dialogMessage);
		});

		dislikeButton.addEventListener("click", () => {
			const currentStatus = localStorage.getItem(
				localStorageFeedbackStatusKey
			);
			let dialogTitle = "Agradecemos o Feedback";
			let dialogMessage =
				"Lamentamos que não tenha gostado. Seu feedback nos ajuda a melhorar!";
			if (currentStatus === "disliked") {
				localStorage.setItem(localStorageFeedbackStatusKey, "none");
				dialogTitle = "Feedback Removido";
				dialogMessage = "Seu feedback negativo foi removido.";
			} else {
				localStorage.setItem(localStorageFeedbackStatusKey, "disliked");
				if (likeButton) likeButton.classList.remove("liked");
			}
			updateVoteUI();
			openFeedbackDialog(dialogTitle, dialogMessage);
		});
	} else {
		console.warn(
			"Botões de like/dislike não encontrados ou likeCountSpan ausente. Verifique os IDs no HTML."
		);
	}

	if (closeFeedbackDialogButton) {
		closeFeedbackDialogButton.addEventListener(
			"click",
			closeFeedbackDialog
		);
	}
	if (feedbackDialogOverlay) {
		feedbackDialogOverlay.addEventListener("click", (event) => {
			if (event.target === feedbackDialogOverlay) {
				closeFeedbackDialog();
			}
		});
	}
	document.addEventListener("keydown", (event) => {
		if (
			event.key === "Escape" &&
			feedbackDialogOverlay &&
			feedbackDialogOverlay.classList.contains("active")
		) {
			closeFeedbackDialog();
		}
	});

	if (feedbackForm) {
		feedbackForm.addEventListener("submit", async (event) => {
			event.preventDefault(); // Impede o envio padrão do formulário

			const rating = feedbackRatingInput.value;
			const comment = feedbackTextInput.value;
			const voteStatus = localStorage.getItem(
				localStorageFeedbackStatusKey
			);

			const formspreeUrl = feedbackForm.action; // Pega o URL do Formspree do HTML

			// Crie um objeto FormData. É a maneira mais robusta para formulários.
			const formData = new FormData();
			formData.append("vote_status", voteStatus || "none");
			formData.append("rating", rating);
			formData.append("comment", comment);
			formData.append("page_url", window.location.href);

			try {
				const response = await fetch(formspreeUrl, {
					method: "POST",
					// NÃO inclua o cabeçalho 'Content-Type' quando usar FormData.
					// O navegador o definirá corretamente, incluindo o boundary necessário.
					body: formData,
					// É crucial remover ou não incluir 'Accept: application/json'
					// para que o Formspree responda com a política CORS correta para o sucesso.
					// headers: { 'Accept': 'application/json' } // <-- REMOVA ESTA LINHA OU COMENTE-A
				});

				// O Formspree geralmente redireciona para uma página de "obrigado" ou
				// retorna um status 200 OK com uma resposta vazia/simples em caso de sucesso.
				// Apenas verificar response.ok é suficiente.
				if (response.ok) {
					console.log("Feedback enviado para Formspree com sucesso!");
					// Limpa o estado local do feedback (se quiser que o usuário possa enviar de novo)
					localStorage.removeItem(localStorageFeedbackStatusKey);
					localStorage.removeItem(localStorageRatingKey);
					localStorage.removeItem(localStorageCommentKey);
					updateVoteUI(); // Reseta os botões de like/dislike visualmente
					closeFeedbackDialog(); // Fecha o diálogo
				} else {
					console.error(
						"Erro ao enviar feedback para Formspree:",
						response.status,
						response.statusText
					);
					// Tente logar o corpo da resposta para mais detalhes, se houver
					const errorText = await response.text();
					console.error("Detalhes do erro do Formspree:", errorText);
					// Exiba uma mensagem de erro mais amigável ao usuário
					alert(
						"Ocorreu um erro ao enviar seu feedback. Por favor, tente novamente."
					);
				}
			} catch (error) {
				console.error("Erro na conexão ou requisição:", error);
				alert(
					"Não foi possível conectar ao servidor de feedback. Verifique sua conexão com a internet."
				);
			}
		});
	}

	// fim do DOM
});
