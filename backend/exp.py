from match.utils import split_pairs


def create_pairs1(n):
    numbers = list(range(1, n + 1))
    half = n // 2
    group1 = numbers[:half]
    group2 = numbers[half:][::-1]
    pairs = [[group1[i], group2[i]] for i in range(half)]
    return pairs


def split_into_four_groups(pairs):
    group_a = []
    group_b = []
    group_c = []
    group_d = []
    for i, pair in enumerate(pairs):
        if i % 4 == 0:
            group_a.append(pair)
        elif i % 4 == 1:
            group_b.append(pair)
        elif i % 4 == 2:
            group_c.append(pair)
        else:
            group_d.append(pair)
    return group_a, group_b, group_c, group_d


users = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32]

users_pairs = split_pairs(users)

# Пример использования
# pairs = create_pairs(32)
group_a, group_b, group_c, group_d = split_into_four_groups(users_pairs)
print("Group A:", group_a)
# for pair in group_a:
#     print(pair)
print("Group B:", group_b)
# for pair in group_b:
#     print(pair)
print("Group C:", group_c)
# for pair in group_c:
#     print(pair)
print("Group D:", group_d)
# for pair in group_d:
#     print(pair)
print('------------------------------------------------')

#users = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20] 

#print(split_pairs(users))


def create_pairs(n):
    numbers = list(range(1, n + 1))
    half = n // 2
    group1 = numbers[:half]
    group2 = numbers[half:][::-1]
    pairs = [[group1[i], group2[i]] for i in range(half)]
    return pairs


def split_into_groups(pairs, num_groups):
    groups = [[] for _ in range(num_groups)]
    for i, pair in enumerate(pairs):
        groups[i % num_groups].append(pair)
    return groups


def get_num_groups(num_players):
    if num_players <= 8:
        return 1
    elif num_players <= 16:
        return 2
    elif num_players <= 32:
        return 4
    elif num_players <= 64:
        return 8
    elif num_players <= 128:
        return 16
    else:
        raise ValueError("Number of players exceeds the supported limit")


# Пример использования
num_players = 32
pairs = create_pairs(num_players)
num_groups = get_num_groups(num_players)
groups = split_into_groups(pairs, num_groups)

# Вывод результатов
for i, group in enumerate(groups):
    print(f"Group {i+1}:", group)
