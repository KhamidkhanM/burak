# Task s
def missingNumber(nums):
    n = len(nums)
    expected = n * (n + 1) // 2
    actual = sum(nums)
    return expected - actual


print(missingNumber([3, 0, 1]))

# Task R
# def calculate(text):
#     a, operator, b = text.split()
#     a = int(a)
#     b = int(b)

#     if operator == "+":
#         return a + b
#     elif operator == "-":
#         return a - b
#     elif operator == "*":
#         return a * b
#     elif operator == "/":
#         return a / b


# print(calculate("1 + 3"))

# Task Q


# def has_property(obj, key):
#     return key in obj


# print(has_property({"name": "BMW"}, "name"))


# Task P
# def object_to_array(obj):
#     result = []

#     for key, value in obj.items():
#         result.append([key, value])

#     return result


# print(object_to_array({"a": 10, "b": 20}))


# Task O
# def calculate_sum_of_numbers(arr):
#     total = 0

#     for item in arr:
#         if type(item) == int or type(item) == float:
#             total = total + item

#     return total


# print(calculate_sum_of_numbers([10, "10", {"son": 10}, True, 35]))

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
