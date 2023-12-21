import nltk
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB
#文本数据收集
questions=[
    "请问 ，如何才能补卡",
    "我想咨询如何补卡",
    "智慧环卫如何补卡？"
]
answers=["考勤统计无法查看，考勤无法查看——考勤统计在项目管理-考勤管理中查看，如下图","因系统问题主管无法做主管考核，在项目管理-考核管理-员工考核-新增，可以进行补做主管考核","因系统问题导致没及时打上、下班卡，在OA提“智慧环卫考勤异常报备流程”进行补卡；"
    ]
#文本预处理
tfidf=TfidfVectorizer()
X=tfidf.fit_transform(questions)
#模型训练
clf=MultinomialNB()
clf.fit(X, answers)
#用户输入问题
# question="我想知道如何购买产品。"
question="智慧环卫"
#特征提取
question_vec=tfidf.transform([question])
#模型预测
answer=clf.predict(question_vec)
print("系统回答：", answer[0])
