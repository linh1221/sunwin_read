class TaiXiuAI {
    constructor() {
        this.history = [];
        this.maxHistory = 20;
        this.lastPattern = "";
    }
    
    addResult(result, dice) {
        if (this.history.length >= this.maxHistory) {
            this.history.shift(); // Xóa ván cũ nhất
        }
        this.history.push({ result, dice });
    }
    
    analyzePattern() {
        let countTai = this.history.filter(h => h.result === 'Tài').length;
        let countXiu = this.history.length - countTai;
        
        let prediction = countTai > countXiu ? 'Tài' : 'Xỉu';
        let confidence = (Math.max(countTai, countXiu) / this.history.length) * 100;
        
        return { prediction, confidence: confidence.toFixed(2) + '%' };
    }
    
    analyzeDiceProbabilities() {
        let diceCount = Array(6).fill(0);
        this.history.forEach(h => {
            h.dice.forEach(num => diceCount[num - 1]++);
        });
        
        let totalDice = this.history.length * 3;
        return diceCount.map((count, index) => `Xúc xắc ${index + 1}: ${((count / totalDice) * 100).toFixed(2)}%`);
    }
    
    detectPatterns() {
        let pattern = "Loạn cầu";
        let historyArr = this.history.map(h => h.result);
        let historyStr = historyArr.join('-');
        
        const patterns = {
            "Cầu Bệt": /^(Tài-)+Tài$|^(Xỉu-)+Xỉu$/,
            "Cầu Nhảy": /^(Tài-Xỉu)+$|^(Xỉu-Tài)+$/,
            "Cầu 2-2": /^(Tài-Tài-Xỉu-Xỉu)+$|^(Xỉu-Xỉu-Tài-Tài)+$/,
            "Cầu 3-3": /^(Tài-Tài-Tài-Xỉu-Xỉu-Xỉu)+$|^(Xỉu-Xỉu-Xỉu-Tài-Tài-Tài)+$/,
            "Cầu 4-3": /^(Tài-Tài-Tài-Tài-Xỉu-Xỉu-Xỉu)+$|^(Xỉu-Xỉu-Xỉu-Xỉu-Tài-Tài-Tài)+$/,
            "Cầu 5-5": /^(Tài-Tài-Tài-Tài-Tài-Xỉu-Xỉu-Xỉu-Xỉu-Xỉu)+$|^(Xỉu-Xỉu-Xỉu-Xỉu-Xỉu-Tài-Tài-Tài-Tài-Tài)+$/,
            "Cầu 1-2-4": /^(Tài-Xỉu-Tài-Tài-Xỉu-Xỉu-Xỉu)+$|^(Xỉu-Tài-Xỉu-Xỉu-Tài-Tài-Tài)+$/,
            "Cầu 4-3-1-1": /^(Tài-Tài-Tài-Xỉu-Xỉu-Tài-Xỉu)+$|^(Xỉu-Xỉu-Xỉu-Tài-Tài-Xỉu-Tài)+$/,
            "Cầu 1-2-4-6": /^(Tài-Xỉu-Tài-Tài-Xỉu-Xỉu-Xỉu-Tài-Tài-Tài-Tài-Xỉu-Xỉu-Xỉu-Xỉu)+$/,
            "Cầu 5-4-3-2-1": /^(Tài-Tài-Tài-Tài-Tài-Xỉu-Xỉu-Xỉu-Xỉu-Tài-Tài-Tài-Xỉu-Xỉu-Tài)+$/
        };
        
        for (let i = 6; i <= 170; i++) {
            patterns[`Cầu ${i}-${i}`] = new RegExp(`^(Tài-){${i}}Xỉu-(Xỉu-){${i}}Tài+$`);
        }
        
        for (let key in patterns) {
            if (patterns[key].test(historyStr)) {
                pattern = key;
                break;
            }
        }
        
        if (this.lastPattern && this.lastPattern !== pattern) {
            document.getElementById("chuyen-cau").innerText = "Trạng thái cầu: Đang chuyển cầu";
        } else {
            document.getElementById("chuyen-cau").innerText = "Trạng thái cầu: Ổn định";
        }
        this.lastPattern = pattern;
        
        return pattern;
    }
}

const ai = new TaiXiuAI();

function themKetQua(result, dice) {
    ai.addResult(result, dice);
    document.getElementById("du-doan").innerText = `Dự đoán: ${ai.analyzePattern().prediction} ${ai.analyzePattern().confidence}`;
    document.getElementById("xac-suat").innerText = `Xác suất xúc xắc: ${ai.analyzeDiceProbabilities().join(', ')}`;
    document.getElementById("cau-keo").innerText = `Cầu kèo: ${ai.detectPatterns()}`;
}
