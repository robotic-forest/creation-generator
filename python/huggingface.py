from transformers import pipeline
import string
import re

def chunks(lst, n):
  for i in range(0, len(lst), n):
      yield lst[i:i + n]

# To setup, use https://huggingface.co/docs/transformers/installation
text = ''
with open('tmp/pdf-text.txt') as f:
    for line in f.readlines():
      line.strip()
      text += line

cleaned_text = re.sub(' +', ' ', text.replace('\n', ''))

approx_tokens = 2 * sum([i.strip(string.punctuation).isalpha() for i in cleaned_text.split()])
model_size = 1024

slice_value = int(len(cleaned_text) / ((approx_tokens / model_size) * 2))

n = slice_value
chunks = [cleaned_text[i:i+n] for i in range(0, len(cleaned_text), n)]

print('Initializing model: bart-large-cnn...')
summarizer = pipeline("summarization", model="facebook/bart-large-cnn")

result = ''
for chunk in chunks:
  print('\nInput Text:\n')
  print(chunk)
  print('\nSummary:\n')
  summary = summarizer(chunk, max_length=200, min_length=100, do_sample=False)
  output = summary[0]['summary_text']
  print(output)
  result += output

print('\nFinal Output:\n')
print(output)