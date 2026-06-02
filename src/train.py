# Task O
def calculate_sum_of_numbers(arr):
    total = 0

    for item in arr:
        if type(item) == int or type(item) == float:
            total = total + item

    return total


print(calculate_sum_of_numbers([10, "10", {"son": 10}, True, 35]))

# Task N
# def palindromCheck(s):
#     return s == "".join(reversed(s))


# print(palindromCheck("racecar"))

# Task M
# result = []


# def getSquareNumbers(n):
#     for i in n:
#         result.append({"number": i, "square": i * i})
#     return result


# print(getSquareNumbers([5, 7, 10]))


# Task L
# def reverse_sentence(sentence):
#     words = sentence.split(" ")

#     reversed_words = [word[::-1] for word in words]

#     return " ".join(reversed_words)


# print(reverse_sentence("I like coding!"))
