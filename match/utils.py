import random
import itertools


def split_pairs(users):
    new_list = []
    group1 = []
    group2 = []
    # TODO оптимизировать
    if len(users) < 2:
        for i in range(len(users), 2):
            users.append('')
    elif len(users) < 4:
        for i in range(len(users), 4):
            users.append('')
    # до 8 участников
    elif len(users) < 8:
        for i in range(len(users), 8):
            users.append('')
    # до 16 участников
    elif len(users) > 8 and len(users) < 16:
        for i in range(len(users), 16):
            users.append('')
    # до 32 участников
    elif len(users) > 16 and len(users) < 32:
        for i in range(len(users), 32):
            users.append('')
    # до 64 участников
    elif len(users) > 32 and len(users) < 64:
        for i in range(len(users), 64):
            users.append('')
    # до 128 участников
    elif len(users) > 64 and len(users) < 128:
        for i in range(len(users), 128):
            users.append('')

    for i in range(0, len(users)):
        if i < len(users) / 2:
            group1.append(users[i])
        else:
            group2.append(users[i])
    
    
    for i in range(0, len(group1)):
        new_list.append([group1[i], group2[i]])
            
    return new_list


def pairs_generator(users):
    pairs = itertools.combinations(users, 2)
    return pairs

#users = ['1', '2', '3']
#print(split_pairs(users))