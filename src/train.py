# Task Z
def sumEvens(arr):
    total = 0
    for num in arr:
        if num % 2 == 0:
            total += num
    return total


print(sumEvens([1, 2, 3]))

# Task Y
# def findIntersection(array1, array2):
#     result = []
#     for item in array1:
#         if item in array2:
#             result.append(item)
#     return result


# print(findIntersection([1, 2, 3], [3, 2, 0]))

# Task X

# def countOccurrences(dictionary, target):
#     count = 0
#     for key, value in dictionary.items():
#         if key == target:
#             count += 1
#         if isinstance(value, dict):
#             count += countOccurrences(value, target)
#     return count


# print(countOccurrences({"model": "A", "s": {"model": "B"}}, "model"))


# Task W
# def chunk_array(array, size):
#     result = []

#     for i in range(0, len(array), size):
#         chunk = array[i:i + size]
#         result.append(chunk)

#     return result


# print(chunk_array([1, 2, 3, 4, 5], 2))

# Task V
# def count_chars(str):
#     result = {}

#     for char in str:
#         if char in result:
#             result[char] = result[char] + 1
#         else:
#             result[char] = 1

#     return result


# print(count_chars("hello"))  # {'h': 1, 'e': 1, 'l': 2, 'o': 1}

# Task T
# def mergeSortedArrays(a, b):
#     result = []
#     i = 0
#     j = 0

#     while i < len(a) and j < len(b):
#         if a[i] <= b[j]:
#             result.append(a[i])
#             i += 1
#         else:
#             result.append(b[j])
#             j += 1

#     while i < len(a):
#         result.append(a[i])
#         i += 1

#     while j < len(b):
#         result.append(b[j])
#         j += 1

#     return result


# print(mergeSortedArrays([0, 3, 4], [4, 6]))

# Task s
# def missingNumber(nums):
#     n = len(nums)
#     expected = n * (n + 1) // 2
#     actual = sum(nums)
#     return expected - actual


# print(missingNumber([3, 0, 1]))

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
