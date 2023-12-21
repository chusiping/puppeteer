import nltk
from nltk.tokenize import word_tokenize

# nltk.download('punkt')  # 下载必要的数据

text = "NLTK makes natural language processing easy."

tokens = word_tokenize(text)
print("分词结果:", tokens)
