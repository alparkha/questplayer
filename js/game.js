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

class Quest {
    constructor(title, description, difficulty, deadline) {
        this.id = Date.now().toString();
        this.title = title;
        this.description = description;
        this.difficulty = difficulty;
        this.deadline = deadline;
        this.completed = false;
        this.createdAt = new Date();
        this.completedAt = null;
        this.rewards = this.calculateRewards();
    }

    calculateRewards() {
        const baseRewards = {
            normal: { exp: 50, focus: 1, execution: 1, creativity: 1 },
            rare: { exp: 100, focus: 2, execution: 2, creativity: 2 },
            epic: { exp: 200, focus: 3, execution: 3, creativity: 3 },
            legendary: { exp: 500, focus: 5, execution: 5, creativity: 5 }
        };
        return baseRewards[this.difficulty];
    }
}

class QuestPlayer {
    constructor() {
        this.initializeUI();
        this.addEventListeners();
        this.selectedClass = null;
        this.character = null;
        this.quests = [];
        this.loadQuests();
        this.initializeQuestSystem();
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

        // 퀘스트 관련 UI 요소
        this.questModal = document.getElementById('quest-modal');
        this.questForm = document.getElementById('quest-form');
        this.addQuestBtn = document.getElementById('add-quest-btn');
        this.activeQuestsList = document.getElementById('active-quests');
        this.completedQuestsList = document.getElementById('completed-quests');
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

    initializeQuestSystem() {
        // 퀘스트 추가 버튼
        this.addQuestBtn.addEventListener('click', () => {
            this.showQuestModal();
        });

        // 퀘스트 생성 폼 제출
        this.questForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.createNewQuest();
        });

        // 모달 취소 버튼
        this.questForm.querySelector('.cancel').addEventListener('click', () => {
            this.hideQuestModal();
        });

        // 초기 퀘스트 목록 렌더링
        this.renderQuests();
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

    showQuestModal() {
        this.questModal.classList.remove('hidden');
    }

    hideQuestModal() {
        this.questModal.classList.add('hidden');
        this.questForm.reset();
    }

    createNewQuest() {
        const title = document.getElementById('quest-title').value;
        const description = document.getElementById('quest-description').value;
        const difficulty = document.getElementById('quest-difficulty').value;
        const deadline = document.getElementById('quest-deadline').value;

        const quest = new Quest(title, description, difficulty, deadline);
        this.quests.push(quest);
        this.saveQuests();
        this.renderQuests();
        this.hideQuestModal();
    }

    renderQuests() {
        // 진행중인 퀘스트
        const activeQuests = this.quests.filter(q => !q.completed);
        this.activeQuestsList.innerHTML = activeQuests.map(quest => this.createQuestCard(quest)).join('');

        // 완료된 퀘스트
        const completedQuests = this.quests.filter(q => q.completed);
        this.completedQuestsList.innerHTML = completedQuests.map(quest => this.createQuestCard(quest)).join('');

        // 퀘스트 클릭 이벤트 추가
        document.querySelectorAll('.quest-card').forEach(card => {
            card.addEventListener('click', () => {
                const questId = card.dataset.questId;
                const quest = this.quests.find(q => q.id === questId);
                if (!quest.completed) {
                    this.completeQuest(quest);
                }
            });
        });
    }

    createQuestCard(quest) {
        return `
            <div class="quest-card ${quest.difficulty}" data-quest-id="${quest.id}">
                <div class="quest-title">${quest.title}</div>
                <div class="quest-description">${quest.description}</div>
                ${quest.deadline ? `<div class="quest-deadline">마감: ${new Date(quest.deadline).toLocaleString()}</div>` : ''}
            </div>
        `;
    }

    completeQuest(quest) {
        if (confirm('퀘스트를 완료하시겠습니까?')) {
            quest.completed = true;
            quest.completedAt = new Date();
            this.applyQuestRewards(quest);
            this.saveQuests();
            this.renderQuests();
            this.showQuestCompleteAnimation(quest);
        }
    }

    applyQuestRewards(quest) {
        const rewards = quest.rewards;
        this.character.exp += rewards.exp;
        this.character.stats.focus += rewards.focus;
        this.character.stats.execution += rewards.execution;
        this.character.stats.creativity += rewards.creativity;
        
        // 레벨업 체크
        this.checkLevelUp();
        
        // 캐릭터 정보 저장
        this.saveCharacter();
    }

    showQuestCompleteAnimation(quest) {
        // TODO: 화려한 완료 애니메이션 추가
        alert(`퀘스트 완료!\n보상:\nEXP +${quest.rewards.exp}\n집중력 +${quest.rewards.focus}\n실행력 +${quest.rewards.execution}\n창의력 +${quest.rewards.creativity}`);
    }

    checkLevelUp() {
        const expNeeded = this.character.level * 1000;
        if (this.character.exp >= expNeeded) {
            this.character.level++;
            this.character.exp -= expNeeded;
            alert(`레벨 업! 현재 레벨: ${this.character.level}`);
        }
    }

    saveQuests() {
        localStorage.setItem('questPlayerQuests', JSON.stringify(this.quests));
    }

    loadQuests() {
        const savedQuests = localStorage.getItem('questPlayerQuests');
        this.quests = savedQuests ? JSON.parse(savedQuests) : [];
    }

    saveCharacter() {
        localStorage.setItem('questPlayerCharacter', JSON.stringify(this.character));
    }
}

// 게임 시작
window.onload = () => {
    new QuestPlayer();
};
