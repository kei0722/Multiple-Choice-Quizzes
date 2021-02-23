'use strict';

{
	const URL = 'https://opentdb.com/api.php?amount=10&type=multiple';
	const main = document.querySelector('main');
	let questionIndex = 0;
	let correct = 0;

	function deleteMain() {
		while (main.firstChild) {
			main.removeChild(main.firstChild);
		}
	}

	class BasicPage {
		constructor() {
			this.title = document.createElement('h2');
			main.appendChild(this.title);

			this.statement = document.createElement('p');
			this.statement.id = 'statement';
			main.appendChild(this.statement);
		}
	}

	class FirstPage {
		constructor(basicPage) {
			this.basicPage = basicPage;
			this.getText();
			this.makeBtn();
		}

		getText() {
			this.basicPage.title.textContent = 'ようこそ';
			this.basicPage.statement.textContent = '以下のボタンをクリック';
		}

		makeBtn() {
			this.btn = document.createElement('button');
			this.btn.textContent = '開始';
	
			this.btn.addEventListener('click', () => {
				this.btnFnc();
			});
			main.appendChild(this.btn);
		}
		
		async btnFnc() {
			deleteMain();
			new LoadingPage(new BasicPage());

			try {
				const response = await fetch(URL);
				const json = await response.json();
				const questions = json.results;
				deleteMain();
				new Question(new BasicPage(), questions);
			} catch (e) {
				console.error(e);
			}
		}
	}

	class LoadingPage {
		constructor(basicPage) {
			this.basicPage = basicPage;
			this.getText();
		}
		
		getText() {
			this.basicPage.title.textContent = '取得中';
			this.basicPage.statement.textContent = '少々お待ちください';
		}
	}
	
	class Question {
		constructor(basicPage, questions) {
			this.basicPage = basicPage;
			this.questions = questions;

			this.getText();
			this.getCategory();
			this.getDifficulty();
			
			this.ul = document.createElement('ul');
			
			this.choices = this.getshuffledChoices();
			
			for (let i = 0; i < 4; i++) {
				this.btn = document.createElement('button');
				this.btn.textContent = `${this.choices[i]}`;
				this.li = document.createElement('li');
				this.li.appendChild(this.btn);
				this.ul.appendChild(this.li);
				
				this.btn.addEventListener('click', () => {
					this.btnFnc(i);
				});
			}
			
			main.appendChild(this.ul);
		}
		
		getText() {
			this.basicPage.title.textContent = `問題${questionIndex + 1}`;
			this.basicPage.statement.textContent = this.questions[questionIndex].question;
		}

		getCategory() {
			this.category = document.createElement('p');
			this.category.classList.add('detail');
			this.category.textContent = `[ジャンル] ${this.questions[questionIndex].category}`;
			main.insertBefore(this.category, this.basicPage.statement);
		}

		getDifficulty() {
			this.difficulty = document.createElement('p');
			this.difficulty.classList.add('detail');
			this.difficulty.textContent = `[難易度] ${this.questions[questionIndex].difficulty}`;
			main.insertBefore(this.difficulty, this.basicPage.statement);
		}

		getChoices() {
			this.OriginalChoices = [];
			this.OriginalChoices.push(this.questions[questionIndex].correct_answer);
			this.OriginalChoices.push(...this.questions[questionIndex].incorrect_answers);
			return this.OriginalChoices;
		}

		getshuffledChoices() {
			this.shuffledChoices = this.shuffle([...this.getChoices()]);
			return this.shuffledChoices;
		}

		shuffle(array) {
			for (let i = array.length - 1; i >= 0; i--) {
				const j = Math.floor(Math.random() * (i + 1));
				[array[i], array[j]] = [array[j], array[i]];
			}
			return array;
		}

		btnFnc(i) {
			this.checkAnswer(this.choices[i]);
			questionIndex++;
			deleteMain();
			
			if (questionIndex >= 10) {
				new LastPage(new BasicPage());
			} else {
				new Question(new BasicPage(), this.questions);
			}
		}

		checkAnswer(chosen) {
			if (chosen === this.getChoices()[0]) {
				correct++;
			}
		}
	}

	class LastPage {
		constructor(basicPage) {
			this.basicPage = basicPage;
			this.getText();
			this.makeBtn();
		}

		getText() {
			this.basicPage.title.textContent = `あなたの正解数は${correct}です！！`;
			this.basicPage.statement.textContent = '再度チャンレンジしたい場合は以下をクリック！！';
		}

		makeBtn() {
			this.btn = document.createElement('button');
			this.btn.textContent = 'ホームに戻る';
			const _this = this.basicPage;
	
			this.btn.addEventListener('click', () => {
				this.btnFnt()
			});
			main.appendChild(this.btn);
		}
		
		btnFnt() {
			deleteMain();
			questionIndex = 0;
			correct = 0;
			new FirstPage(new BasicPage());
		}
	}

	new FirstPage(new BasicPage());
}
