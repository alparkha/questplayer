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
        const activeQuestsList = document.getElementById('active-quests');
        const completedQuestsList = document.getElementById('completed-quests');
        
        // 기존 퀘스트 초기화
        activeQuestsList.innerHTML = '';
        completedQuestsList.innerHTML = '';

        // 퀘스트 필터링
        let filteredQuests = this.quests.filter(quest => {
            if (currentFilter === 'all') return true;
            return quest.difficulty === currentFilter;
        });

        // 퀘스트 정렬
        filteredQuests.sort((a, b) => {
            switch (currentSort) {
                case 'deadline':
                    return new Date(a.deadline) - new Date(b.deadline);
                case 'created':
                    return new Date(a.createdAt) - new Date(b.createdAt);
                case 'difficulty':
                    const difficultyOrder = { normal: 0, rare: 1, epic: 2, legendary: 3 };
                    return difficultyOrder[b.difficulty] - difficultyOrder[a.difficulty];
                default:
                    return 0;
            }
        });

        // 퀘스트 렌더링
        filteredQuests.forEach(quest => {
            const questCard = document.createElement('div');
            questCard.className = `quest-card ${quest.difficulty}`;
            questCard.innerHTML = `
                <div class="quest-actions">
                    <button class="quest-action-btn edit" onclick="editQuest('${quest.id}')">✎</button>
                    <button class="quest-action-btn delete" onclick="deleteQuest('${quest.id}')">×</button>
                </div>
                <h3>${quest.title}</h3>
                <p>${quest.description}</p>
                <div class="quest-info">
                    <span class="difficulty ${quest.difficulty}">${quest.difficulty}</span>
                    <span class="deadline">마감: ${formatDate(quest.deadline)}</span>
                </div>
                ${!quest.completed ? `<button onclick="completeQuest('${quest.id}')" class="complete-btn">완료</button>` : ''}
            `;

            if (quest.completed) {
                completedQuestsList.appendChild(questCard);
            } else {
                activeQuestsList.appendChild(questCard);
            }
        });
    }

    completeQuest(questId) {
        if (confirm('퀘스트를 완료하시겠습니까?')) {
            const questIndex = this.quests.findIndex(q => q.id === questId);
            if (questIndex === -1) return;

            this.quests[questIndex].completed = true;
            this.quests[questIndex].completedAt = new Date();
            this.applyQuestRewards(this.quests[questIndex]);
            this.saveQuests();
            this.renderQuests();
            this.showQuestCompleteAnimation(this.quests[questIndex]);
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

// 퀘스트 필터링과 정렬을 위한 전역 변수
let currentFilter = 'all';
let currentSort = 'deadline';

// 필터와 정렬 이벤트 리스너 추가
document.getElementById('quest-filter-difficulty').addEventListener('change', (e) => {
    currentFilter = e.target.value;
    const questPlayer = new QuestPlayer();
    questPlayer.renderQuests();
});

document.getElementById('quest-sort').addEventListener('change', (e) => {
    currentSort = e.target.value;
    const questPlayer = new QuestPlayer();
    questPlayer.renderQuests();
});

// 퀘스트 편집 모달 관련 코드
const questEditModal = document.getElementById('quest-edit-modal');
const questEditForm = document.getElementById('quest-edit-form');

function editQuest(questId) {
    const questPlayer = new QuestPlayer();
    const quest = questPlayer.quests.find(q => q.id === questId);
    if (!quest) return;

    // 폼 필드 채우기
    document.getElementById('edit-quest-id').value = quest.id;
    document.getElementById('edit-quest-title').value = quest.title;
    document.getElementById('edit-quest-description').value = quest.description;
    document.getElementById('edit-quest-difficulty').value = quest.difficulty;
    document.getElementById('edit-quest-deadline').value = quest.deadline.slice(0, 16); // datetime-local 형식에 맞춤

    // 모달 표시
    questEditModal.classList.remove('hidden');
}

questEditForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const questId = document.getElementById('edit-quest-id').value;
    const questPlayer = new QuestPlayer();
    const questIndex = questPlayer.quests.findIndex(q => q.id === questId);

    if (questIndex === -1) return;

    // 퀘스트 업데이트
    questPlayer.quests[questIndex] = {
        ...questPlayer.quests[questIndex],
        title: document.getElementById('edit-quest-title').value,
        description: document.getElementById('edit-quest-description').value,
        difficulty: document.getElementById('edit-quest-difficulty').value,
        deadline: document.getElementById('edit-quest-deadline').value
    };

    // 로컬 스토리지 업데이트
    questPlayer.saveQuests();
    
    // 모달 닫기 및 퀘스트 다시 렌더링
    questEditModal.classList.add('hidden');
    questPlayer.renderQuests();
});

// 퀘스트 삭제 함수
function deleteQuest(questId) {
    if (!confirm('정말로 이 퀘스트를 삭제하시겠습니까?')) return;

    const questPlayer = new QuestPlayer();
    questPlayer.quests = questPlayer.quests.filter(quest => quest.id !== questId);
    questPlayer.saveQuests();
    questPlayer.renderQuests();
}

// 모달 닫기 버튼들
questEditModal.querySelector('.cancel').addEventListener('click', () => {
    questEditModal.classList.add('hidden');
});

questEditModal.querySelector('.delete').addEventListener('click', () => {
    const questId = document.getElementById('edit-quest-id').value;
    questEditModal.classList.add('hidden');
    deleteQuest(questId);
});

// 게임 시작
window.onload = () => {
    new QuestPlayer();
};
