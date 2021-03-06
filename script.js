//   Variaveis Globais    //
const API_QUIZZ = "https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes"

// Variaveis de controle pra tela 2 //
let scrollTo = 0;
let questionsToEnd = null;
let numberQuestionsTotal = null;
let numberCorrectAnswers = 0;
let levelsQuizz

let levelImage = null;
let levelTitle = null;
let levelText = null;

function renderAllUserQuizz() {
	if (allUserQuiz.length !== 0) {
		document.querySelector('.noQuizz').classList.add('hidden')
		document.querySelector('.hasUserQuizz').classList.remove('hidden')

		allUserQuiz.forEach((x) => {

			document.querySelector('.hasUserQuizz').innerHTML += `

			<article onclick="startQuizz(${x.id})" id="${x.id}">
				<img src="${x.image}" alt="quizz tittle image"/>
				<div class="gradient">
					<p class="title">${x.title}</p>
				</div>
	    	</article>	
			`
		})
	}

}

//  Renderização da Tela 1 //
function getAllQuizz() {
	const promise = axios.get(API_QUIZZ);
	promise.then(response => {
		renderAllQuizz(response.data)
	});
}

function renderAllQuizz(quizzes) {
	const all_Quizz = document.querySelector(".allQuizz");
	all_Quizz.innerHTML = ""
	quizzes.forEach(quizz => {
		all_Quizz.innerHTML += `
        <article onclick="startQuizz(${quizz.id})" id="${quizz.id}">
		    <img src="${quizz.image}" alt="quizz tittle image"/>
		    <div class="gradient">
		    <p>${quizz.title}</p>
            </div>
	    </article>
        `
	})
}

function showScreen3() {
	document.querySelector('main').classList.add('hidden')
	document.querySelector('.createQuiz').classList.remove('hidden')
}

//  Renderização da Tela 2 //
const scren2 = document.querySelector('.screen-2-header')
const screenQuestion = document.querySelector('.screen-2-quizz')
let currentQuizz = null;
let selectedQuiz = 0

const mainScreen = document.querySelector('main')
function startQuizz(response) {
	selectedQuiz = response
	const mainScreen = document.querySelector('main')
	mainScreen.classList.add('hidden')
	createQuiz.classList.add('hidden')

	currentQuizz = axios.get(`${API_QUIZZ}/${response}`)

	currentQuizz.then((response) => {
		currentQuizz = response.data
		levelsQuizz = currentQuizz.levels
		scren2.innerHTML = `
        <figure>
            <p>${currentQuizz.title}</p>
            <img src="${currentQuizz.image}" alt="imagem do quizz">
            <div class="gradient-2"></div>
        </figure>
		`
		let newQuestions = response.data.questions

		newQuestions.forEach((question, indexd) => {
			screenQuestion.innerHTML += `
			<section class="box-quizz">
				<div class="title"  style="background-color:${question.color}">
				${question.title}
				</div>
				<div class="questions q${indexd}"></div>
			</section>
			`
			questionNum = question.answers.sort(() => Math.random() - 0.5)

			questionNum.forEach((element,) => {
				document.querySelector(`.questions.q${indexd}`).innerHTML += `
				<span class="question is${element.isCorrectAnswer}" onclick="checkCorret(this)">
						<img src="${element.image}" alt="quizz answer photo">
						<span>${element.text}</span>
					</span>`
			})
		})
		questionsToEnd = document.querySelectorAll('.questions').length;
		numberQuestionsTotal = questionsToEnd;
	})

}

function checkCorret(alternative) {
	const box = alternative.parentNode;
	alternative.classList.add('selected')
	const boxArray = box.querySelectorAll('.question')

	if (alternative.classList[1] == 'istrue') {
		alternative.classList.add('correctAnswer')
		box.style.pointerEvents = "none"

		boxArray.forEach(element => { if (element.classList[2] != 'selected') { element.style.opacity = '0.3' } })

		scrollTo++
		setTimeout(() => {
			document.querySelector(`.questions.q${scrollTo}`).scrollIntoView({ block: "center", behavior: "smooth" })

		}, 2000)
		numberCorrectAnswers++
		questionsToEnd--
		if (questionsToEnd === 0) { endQuizz() }
	}

	else {
		alternative.classList.add('wrongAnswer')
		box.style.pointerEvents = "none"

		boxArray.forEach(element => { if (element.classList[2] != 'selected') { element.style.opacity = '0.3' } })

		scrollTo++
		setTimeout(() => {
			document.querySelector(`.questions.q${scrollTo}`).scrollIntoView({ block: "center", behavior: "smooth" })

		}, 2000)
		questionsToEnd--
		if (questionsToEnd === 0) { endQuizz() }
	}
}

function endQuizz() {
	setTimeout(() => {
		let percentCorrect = Math.round((numberCorrectAnswers / numberQuestionsTotal) * 100)

		levelsQuizz = levelsQuizz.sort(function (a, b) {
			return a.minValue - b.minValue
		}
		)
		levelsQuizz.forEach(level => {
			if (percentCorrect >= level.minValue) {

				levelImage = level.image
				levelTitle = level.title;
				levelText = level.text
				levelPercent = level.minValue;
			}

		})

		const levelBox = document.querySelector('.screen-2-quizz')
		levelBox.innerHTML += `
			<section class="boxLevelQuizz">
			<div class="titlefinal">
				<h5>${percentCorrect}% de acerto: ${levelTitle} </h5>
			</div>
			<div class="boxLevelQuizzBottom">
				<img src="${levelImage}" alt="photo level answer"> 
				<div class="description"> <h6>${levelText}</h6> </div>
			</div>
			</section>
		`
		restartBtn()
		screenQuestion.querySelector(".finalButton").scrollIntoView({ block: "center", behavior: "smooth" })
	}, 2001)

}

function restartBtn() {
	screenQuestion.innerHTML += `
	<button class="reduceBtn" onclick=restart()>
        <span>Reiniciar Quizz</span>
    </button>
	<div class="finalButton">
        <span onclick="reload()">Voltar pra home</span>
    </div>
	`
}

const reload = () => window.location.reload()

function restart() {
	screenQuestion.innerHTML = ""
	scrollTo = 0;
	questionsToEnd = null;
	numberCorrectAnswers = 0;
	numberQuestionsTotal = null
	startQuizz(selectedQuiz)
	scroll('screen-2-header')
}

function scroll(box) {
	let elementoQueQueroQueApareca = document.querySelector(`.${box}`);
	elementoQueQueroQueApareca.scrollIntoView({ behavior: 'smooth', block: 'center' });
}


////////////////Criação Quiz////////////////

const quizDone = {
	title: '',
	image: '',
	questions: [],
	levels: []
}

const createQuiz = document.querySelector('.createQuiz')
const basicInfoScreen = createQuiz.querySelector('.basicInfoScreen')
const questionScreen = createQuiz.querySelector('.questionScreen')
const lvlScreen = createQuiz.querySelector('.lvlScreen')
const endScreen = createQuiz.querySelector('.endScreen')

const quizTitle = createQuiz.querySelector('input:first-child')
const quizImg = createQuiz.querySelector('input:nth-child(2)')
const numberQuestions = createQuiz.querySelector('input:nth-child(3)')
const numberLvls = createQuiz.querySelector('input:nth-child(4)')

let h3 = createQuiz.querySelector('h3')
let buttonCreateQuiz = createQuiz.querySelector('button')

function saveBasicInfo() {
	if (checkURL(quizImg.value) === false || !quizTitle.checkValidity() ||
		!quizImg.checkValidity() || !numberQuestions.checkValidity() || !numberLvls.checkValidity()) {
		alert('Dados inválidos! Insira os dados corretamente.')
	} else {
		quizDone.title = quizTitle.value
		quizDone.image = quizImg.value

		hideScreen('Crie suas perguntas', basicInfoScreen, 'saveQuestions()', 'Prosseguir pra criar níveis')
		createQuestions()
	}
}

function createQuestions() {
	for (let i = 0; i < numberQuestions.value; i++) {
		questionScreen.innerHTML += `
		<div class="box">
        	<h3>Pergunta ${i + 1}</h3>
        	<ion-icon name="create-outline" onclick="openBox(this,questionScreen,'questionOpen')"></ion-icon>
			<div class="questionOpen hidden">
				<input class="questionText" type="text" placeholder="Texto da pergunta" minlength="20" required></input>
				<input class="questionColor" type="text" placeholder="Cor de fundo da pergunta" minlength="7" maxlength="7" required></input>
			
				<h3 class="marginH3">Resposta correta</h3>
				<input class="correctText" type="text" placeholder="Resposta correta" required></input>
				<input class="correctImg" type="url" placeholder="URL da imagem" required></input>
			
				<h3 class="marginH3">Respostas incorretas</h3>
				<input class="incorrectText1" type="text" placeholder="Resposta incorreta 1" required></input>
				<input class="incorrectImg1 margin32" type="url" placeholder="URL da imagem 1" required></input>
			
				<input class="incorrectText2" type="text" placeholder="Resposta incorreta 2"></input>
				<input class="incorrectImg2 margin32" type="url" placeholder="URL da imagem 2"></input>
			
				<input class="incorrectText3" type="text" placeholder="Resposta incorreta 3"></input>
				<input class="incorrectImg3" type="url" placeholder="URL da imagem 3"></input>
			</div>
		</div>
		`
	}
	openFirstBox('questionOpen')
}

function saveQuestions() {
	const questions = questionScreen.querySelectorAll('.box')

	for (let i = 0; i < questions.length; i++) {
		let question = questions[i]
		let questionText = question.querySelector('.questionText')
		let questionColor = question.querySelector('.questionColor')

		let correctText = question.querySelector('.correctText')
		let correctImg = question.querySelector('.correctImg')

		let incorrectText1 = question.querySelector('.incorrectText1')
		let incorrectImg1 = question.querySelector('.incorrectImg1')

		let incorrectText2 = question.querySelector('.incorrectText2')
		let incorrectImg2 = question.querySelector('.incorrectImg2')

		let incorrectText3 = question.querySelector('.incorrectText3')
		let incorrectImg3 = question.querySelector('.incorrectImg3')

		let answers = [
			{
				text: correctText.value,
				image: correctImg.value,
				isCorrectAnswer: true
			},
			{
				text: incorrectText1.value,
				image: incorrectImg1.value,
				isCorrectAnswer: false
			}
		]

		if (incorrectText2.value !== '' && incorrectImg2.value !== '') {
			if (checkURL(incorrectImg2.value) === true && incorrectImg2.checkValidity()) {
				answers.push({
					text: incorrectText2.value,
					image: incorrectImg2.value,
					isCorrectAnswer: false
				})
			} else {
				quizDone.questions = []
				return alert('Dados inválidos! Insira os dados corretamente!')
			}
		}
		if (incorrectText3.value !== '' && incorrectImg3.value !== '') {
			if (checkURL(incorrectImg3.value) === true && incorrectImg3.checkValidity()) {
				answers.push({
					text: incorrectText3.value,
					image: incorrectImg3.value,
					isCorrectAnswer: false
				})
			} else {
				quizDone.questions = []
				return alert('Dados inválidos! Insira os dados corretamente!')
			}
		}

		if (isHex(questionColor.value) === false || checkURL(correctImg.value) === false ||
			checkURL(incorrectImg1.value) === false || !questionText.checkValidity() ||
			!questionColor.checkValidity() || !correctText.checkValidity() ||
			!incorrectText1.checkValidity() || !correctImg.checkValidity() || !incorrectImg1.checkValidity()) {

			quizDone.questions = []
			return alert('Dados inválidos! Insira os dados corretamente!')

		} else {
			quizDone.questions.push({
				title: questionText.value,
				color: questionColor.value,
				answers: answers
			})
		}
	}
	hideScreen('Agora, decida os níveis!', questionScreen, 'saveLvls()', 'Finalizar Quizz')
	createLevels()
}

function createLevels() {
	for (let i = 0; i < numberLvls.value; i++) {
		lvlScreen.innerHTML += `
		<div class="box">
        	<h3>Nível ${i + 1}</h3>
        	<ion-icon name="create-outline" onclick="openBox(this,lvlScreen,'lvlOpen')"></ion-icon>
        	<div class="lvlOpen hidden">
            	<input class="lvlText" type="text" placeholder="Título do nível" minlength="10" required></input>
            	<input class="lvlMin" type="number" placeholder="% de acerto mínima" min="0" max="100" required></input>
            	<input class="lvlImg" type="url" placeholder="URL da imagem do nível" required></input>
            	<textarea class="lvlDesc" placeholder="Descrição do nível" minlength="30" required></textarea>
        	</div>
    	</div>
		`
	}
	openFirstBox('lvlOpen')
}

function saveLvls() {
	const levels = lvlScreen.querySelectorAll('.box')

	for (let i = 0; i < levels.length; i++) {
		let level = levels[i]
		let lvlText = level.querySelector('.lvlText')
		let lvlMin = level.querySelector('.lvlMin')
		let lvlImg = level.querySelector('.lvlImg')
		let lvlDesc = level.querySelector('.lvlDesc')

		if (checkURL(lvlImg.value) === false || !lvlText.checkValidity() ||
			!lvlMin.checkValidity() || !lvlImg.checkValidity() || !lvlDesc.checkValidity()) {
			quizDone.levels = []
			return alert('Dados inválidos! Insira os dados corretamente!!')
		} else {
			quizDone.levels.push({
				title: lvlText.value,
				image: lvlImg.value,
				text: lvlDesc.value,
				minValue: lvlMin.value
			})
		}
	}

	if (hasLvl0() === false) {
		quizDone.levels = []
		return alert('Dados inválidos! Insira os dados corretamente!!')
	}

	postQuiz()
}

function postQuiz() {
	const promise = axios.post(API_QUIZZ, quizDone)
	promise.then(response => {
		let userQuizDone = response.data
		let userQuizId = response.data.id
		saveUserQuiz(userQuizDone, userQuizId)
		getAllUserQuiz()
		hideScreen('Seu quizz está pronto!', lvlScreen, `startQuizz(${userQuizId})`, 'Acessar Quizz')
		createEnd()
	})
}

function saveUserQuiz(quiz, id) {
	let quizDoneSerialized = JSON.stringify(quiz)
	localStorage.setItem(`${id}`, quizDoneSerialized)
}

let allUserQuiz = []

function getAllUserQuiz() {
	allUserQuiz = []
	for (let i = 0; i < localStorage.length; i++) {
		let quizId = localStorage.key(i)
		let userQuizSerialized = localStorage.getItem(quizId)
		let userQuiz = JSON.parse(userQuizSerialized)
		allUserQuiz.push(userQuiz)
	}
	return allUserQuiz
}

function createEnd() {
	endScreen.innerHTML = `
    <article>
		<img src="${quizDone.image}" alt="${quizDone.image}"/>
		<div class="gradient">
			<p>${quizDone.title}</p>
        </div>
	</article>
	`
	createQuiz.innerHTML += `
	<div class="finalButton">
        <span onclick="reload()">Voltar pra home</span>
    </div>
	`
	const lastBtn = createQuiz.querySelector('button')
	lastBtn.classList.add('reduceBtn')
}


///////////////Funções Auxiliares da Criação////////////

function checkURL(url) {
	return (url.match(/\.(jpeg|jpg|gif|png)$/) != null);
}

function hideScreen(text, screen, btn, textBtn) {
	h3.innerText = text
	screen.classList.add('hidden')
	buttonCreateQuiz.setAttribute("onclick", btn);
	buttonCreateQuiz.innerHTML = `<span>${textBtn}</span>`
}

function openFirstBox(screenOpen) {
	const box1 = document.querySelector(`.${screenOpen}`)
	const btn1 = box1.parentNode.querySelector('ion-icon')
	btn1.classList.add('hidden')
	box1.parentNode.classList.add('config')
	box1.classList.remove('hidden')
}

function openBox(button, screen, screenOpen) {
	const config = screen.querySelector('.config')
	const btn = config.querySelector('ion-icon')
	btn.classList.remove('hidden')
	const hiddenBox1 = config.querySelector(`.${screenOpen}`)
	hiddenBox1.classList.add('hidden')
	config.classList.remove('config')

	const box = button.parentNode
	button.classList.add('hidden')
	box.classList.add('config')
	const showScreen = box.querySelector(`.${screenOpen}`)
	showScreen.classList.remove('hidden')
	scroll('config h3')
}

const hexChar = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f']
function isHex(color) {
	if (color.substring(0, 1) !== '#') {
		return false
	}
	for (let j = 1; j < color.length; j++) {
		if (!hexChar.includes((color.substring(j, j + 1)).toLowerCase())) {
			return false
		}
	}
	return true
}

function hasLvl0() {
	let hasLvlMin = false
	quizDone.levels.forEach(levelInfo => {
		if (parseInt(levelInfo.minValue) === 0) {
			hasLvlMin = true
		}
	})
	if (hasLvlMin === false) {
		return false
	}
}

//////////////// Inicialização/////////////////// 
getAllUserQuiz()
renderAllUserQuizz()
getAllQuizz()