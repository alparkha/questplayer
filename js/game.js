class Character {
    constructor(name, characterClass) {
        this.name = name;
        this.class = characterClass;
        this.level = 1;
        this.exp = 0;
        this.stats = this.getInitialStats();
    }

    getInitialStats() {
        const baseStats = {
            warrior: { focus: 4, execution: 5, creativity: 2 },
            mage: { focus: 3, execution: 2, creativity: 5 },
            rogue: { focus: 3, execution: 3, creativity: 3 }
        };
        return baseStats[this.class];
    }
}

class QuestPlayer {
    constructor() {
        this.initializeUI();
        this.addEventListeners();
        this.selectedClass = null;
        this.character = null;
    }

    initializeUI() {
        // 화면 요소
        this.screens = {
            start: document.getElementById('start-screen'),
            character: document.getElementById('character-creation'),
            tutorial: document.getElementById('tutorial-screen'),
            main: document.getElementById('main-screen'),
            settings: document.getElementById('settings-screen')
        };

        // 버튼 요소
        this.buttons = {
            newGame: document.getElementById('new-game-btn'),
            continue: document.getElementById('continue-btn'),
            settings: document.getElementById('settings-btn'),
            createCharacter: document.getElementById('create-character')
        };

        // 캐릭터 생성 요소
        this.characterNameInput = document.getElementById('character-name');
        this.classCards = document.querySelectorAll('.class-card');
    }

    addEventListeners() {
        // 게임 시작 버튼
        this.buttons.newGame.addEventListener('click', () => {
            this.showCharacterCreation();
        });

        // 이어하기 버튼
        this.buttons.continue.addEventListener('click', () => {
            this.continueGame();
        });

        // 설정 버튼
        this.buttons.settings.addEventListener('click', () => {
            this.showSettings();
        });

        // 캐릭터 이름 입력 이벤트
        this.characterNameInput.addEventListener('input', () => {
            this.validateCharacterCreation();
        });

        // 직업 선택 이벤트
        this.classCards.forEach(card => {
            card.addEventListener('click', () => {
                this.selectClass(card);
            });
        });

        // 캐릭터 생성 버튼
        this.buttons.createCharacter.addEventListener('click', () => {
            this.createCharacter();
        });
    }

    showCharacterCreation() {
        this.hideAllScreens();
        this.screens.character.classList.remove('hidden');
    }

    selectClass(card) {
        // 이전 선택 제거
        this.classCards.forEach(c => c.classList.remove('selected'));
        // 새로운 선택 추가
        card.classList.add('selected');
        this.selectedClass = card.dataset.class;
        this.validateCharacterCreation();
    }

    validateCharacterCreation() {
        const name = this.characterNameInput.value.trim();
        const isValid = name.length > 0 && this.selectedClass;
        this.buttons.createCharacter.disabled = !isValid;
    }

    createCharacter() {
        const name = this.characterNameInput.value.trim();
        this.character = new Character(name, this.selectedClass);
        
        // 캐릭터 정보를 로컬 스토리지에 저장
        localStorage.setItem('questPlayerCharacter', JSON.stringify(this.character));
        
        // 튜토리얼 시작
        this.startTutorial();
    }

    hideAllScreens() {
        Object.values(this.screens).forEach(screen => {
            screen.classList.add('hidden');
        });
    }

    startTutorial() {
        this.hideAllScreens();
        this.screens.tutorial.classList.remove('hidden');
        
        // 튜토리얼 내용 초기화
        this.screens.tutorial.innerHTML = `
            <h2>환영합니다, ${this.character.name}님!</h2>
            <p>당신의 모험이 시작됩니다!</p>
            <div class="character-info">
                <h3>캐릭터 정보</h3>
                <p>직업: ${this.character.class}</p>
                <p>레벨: ${this.character.level}</p>
                <ul>
                    <li>집중력: ${this.character.stats.focus}</li>
                    <li>실행력: ${this.character.stats.execution}</li>
                    <li>창의력: ${this.character.stats.creativity}</li>
                </ul>
            </div>
            <button id="tutorial-next" class="menu-button">시작하기</button>
        `;

        // 튜토리얼 다음 버튼 이벤트
        document.getElementById('tutorial-next').addEventListener('click', () => {
            this.hideAllScreens();
            this.screens.main.classList.remove('hidden');
        });
    }

    continueGame() {
        // 저장된 게임 데이터 불러오기
        const savedData = localStorage.getItem('questPlayerCharacter');
        if (savedData) {
            this.character = JSON.parse(savedData);
            this.hideAllScreens();
            this.screens.main.classList.remove('hidden');
        } else {
            alert('저장된 게임이 없습니다!');
        }
    }

    showSettings() {
        this.hideAllScreens();
        this.screens.settings.classList.remove('hidden');
    }
}

// 게임 시작
window.onload = () => {
    new QuestPlayer();
};
