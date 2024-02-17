import random
import itertools


def split_pairs(users):
    random.shuffle(users)
    n = 2
    new_list = []
    for i in range(0, len(users), n):
        element = users[i:i+n]
        if len(element) == 1:
            new_list.append(element + [''])
        else:
            new_list.append(element)
    return new_list


def pairs_generator(users):
    pairs = itertools.combinations(users, 2)
    return pairs
