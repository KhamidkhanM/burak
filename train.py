# Task L
def reverse_sentence(sentence):
    words = sentence.split(" ")

    reversed_words = [word[::-1] for word in words]

    return " ".join(reversed_words)


print(reverse_sentence("I like coding!"))
