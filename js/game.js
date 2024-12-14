class QuestPlayer {
    constructor() {
        this.initializeUI();
        this.addEventListeners();
    }

    initializeUI() {
        // 화면 요소
        this.screens = {
            start: document.getElementById('start-screen'),
            tutorial: document.getElementById('tutorial-screen'),
            main: document.getElementById('main-screen'),
            settings: document.getElementById('settings-screen')
        };

        // 버튼 요소
        this.buttons = {
            newGame: document.getElementById('new-game-btn'),
            continue: document.getElementById('continue-btn'),
            settings: document.getElementById('settings-btn')
        };
    }

    addEventListeners() {
        // 게임 시작 버튼
        this.buttons.newGame.addEventListener('click', () => {
            this.startNewGame();
        });

        // 이어하기 버튼
        this.buttons.continue.addEventListener('click', () => {
            this.continueGame();
        });

        // 설정 버튼
        this.buttons.settings.addEventListener('click', () => {
            this.showSettings();
        });
    }

    startNewGame() {
        this.hideAllScreens();
        this.screens.tutorial.classList.remove('hidden');
        this.startTutorial();
    }

    continueGame() {
        // 저장된 게임 데이터 불러오기
        const savedData = localStorage.getItem('questPlayerSave');
        if (savedData) {
            // 게임 데이터 복원 및 메인 화면 표시
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

    hideAllScreens() {
        Object.values(this.screens).forEach(screen => {
            screen.classList.add('hidden');
        });
    }

    startTutorial() {
        // 튜토리얼 내용 초기화
        this.screens.tutorial.innerHTML = `
            <h2>시작하기</h2>
            <p>당신의 일상을 RPG처럼 즐겁게 만들어보세요!</p>
            <button id="tutorial-next" class="menu-button">다음</button>
        `;

        // 튜토리얼 다음 버튼 이벤트
        document.getElementById('tutorial-next').addEventListener('click', () => {
            this.hideAllScreens();
            this.screens.main.classList.remove('hidden');
        });
    }
}

// 게임 시작
window.onload = () => {
    new QuestPlayer();
};
