from sqlalchemy import (TIMESTAMP, Boolean, Column, DateTime, ForeignKey,
                        Integer, String, Text)
# from sqlalchemy.ext.declarative import DeclarativeMeta, declarative_base

from auth.models import (AllWeightClass, CategoryType, CombatType,
                         EventOrganizer, Referee, SportType)
from connection import Base
from teams.models import Team, TeamMember

metadata = Base.metadata


# Спортивное событие
class Event(Base):
    __tablename__ = "Event"
    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)

    # Даты начала и конца самого мероприятия
    start_datetime = Column(DateTime, nullable=False)
    end_datetime = Column(DateTime, nullable=False)

    # Даты начала и конца приёма заявок
    start_request_datetime = Column(DateTime, nullable=False)
    end_request_datetime = Column(DateTime, nullable=False)
    location = Column(String, nullable=False)
    organizer_id = Column(
        Integer,
        ForeignKey(EventOrganizer.id, ondelete="CASCADE")
    )

    # Это документы, которые будут прикладываться
    event_order = Column(String, nullable=True)
    event_system = Column(String, nullable=True)  # и это

    geo = Column(String, nullable=True)
    image_field = Column(String, nullable=True)
    description = Column(Text, nullable=True)


# Участники спортивного события
class EventParticipant(Base):
    __tablename__ = "EventParticipant"
    id = Column(Integer, primary_key=True)
    event_id = Column(Integer, ForeignKey(Event.id, ondelete="CASCADE"))
    team_id = Column(Integer, ForeignKey(Team.id, ondelete="CASCADE"))


# -----------------------------------------------------------------------------


# Матч
class Match(Base):
    __tablename__ = "Match"
    id = Column(Integer, primary_key=True)
    event_id = Column(Integer, ForeignKey(Event.id, ondelete="CASCADE"))

    # тип заполнения турнирной сетки
    combat_type_id = Column(
        Integer,
        ForeignKey(CombatType.id, ondelete="CASCADE")
    )

    # категории спортсмена (кмс, мс и пр)
    category_id = Column(
        Integer,
        ForeignKey(CategoryType.id, ondelete="CASCADE")
    )

    start_datetime = Column(DateTime, nullable=False)
    end_datetime = Column(DateTime, nullable=False)

    # номинальная продолжительность боя в секундах
    nominal_time = Column(Integer, nullable=False)
    mat_vol = Column(Integer, nullable=False)  # количество матов


# Вид спорта матча
class MatchSport(Base):
    __tablename__ = "MatchSport"
    id = Column(Integer, primary_key=True)
    match_id = Column(Integer, ForeignKey(Match.id, ondelete="CASCADE"))
    sport_id = Column(Integer, ForeignKey(SportType.id, ondelete="CASCADE"))


# Весовые категории матча
class MatchWeights(Base):
    __tablename__ = "MatchWeights"
    id = Column(Integer, primary_key=True)
    match_id = Column(Integer, ForeignKey(Match.id, ondelete="CASCADE"))
    weight_id = Column(
        Integer,
        ForeignKey(AllWeightClass.id, ondelete="CASCADE")
    )


# Победители матчей
class MatchWinner(Base):
    __tablename__ = "MatchWinner"
    id = Column(Integer, primary_key=True)
    match_id = Column(Integer, ForeignKey(Match.id, ondelete="CASCADE"))
    winner = Column(Integer, ForeignKey(TeamMember.id, ondelete="CASCADE"))


# Допустимые возрастные категории спортсменов матча
class MatchAge(Base):
    __tablename__ = "MatchAge"
    id = Column(Integer, primary_key=True)
    match_id = Column(Integer, ForeignKey(Match.id, ondelete="CASCADE"))
    age_from = Column(Integer, nullable=False)
    age_till = Column(Integer, nullable=False)


# Допустимые спортивные категории участников матча
class MatchCategory(Base):
    __tablename__ = "MatchCategory"
    id = Column(Integer, primary_key=True)
    match_id = Column(Integer, ForeignKey(Match.id, ondelete="CASCADE"))
    category_id = Column(
        Integer,
        ForeignKey(CategoryType.id, ondelete="CASCADE")
    )


# Пол участников матча
class MatchGender(Base):
    __tablename__ = "MatchGender"
    id = Column(Integer, primary_key=True)
    match_id = Column(Integer, ForeignKey(Match.id, ondelete="CASCADE"))
    gender = Column(Boolean, default=True, nullable=True)


# Участник матча
class MatchParticipant(Base):
    __tablename__ = "MatchParticipant"
    id = Column(Integer, primary_key=True)
    event_id = Column(Integer, ForeignKey(Match.id, ondelete="CASCADE"))
    player_id = Column(Integer, ForeignKey(TeamMember.id, ondelete="CASCADE"))


# -----------------------------------------------------------------------------


# Бой
class Fight(Base):
    __tablename__ = "Fight"
    id = Column(Integer, primary_key=True)
    match_id = Column(Integer, ForeignKey(Match.id, ondelete="CASCADE"))

    # планируемое время начала
    start_datetime = Column(DateTime, nullable=False)

    # фактическое время завершения
    end_datetime = Column(DateTime, nullable=False)

    player_one = Column(
        Integer,
        ForeignKey(MatchParticipant.id, ondelete="CASCADE")
    )
    player_two = Column(
        Integer,
        ForeignKey(MatchParticipant.id, ondelete="CASCADE")
    )
    mat = Column(Integer, nullable=False)


# Судьи боя
class FightReferee(Base):
    __tablename__ = "FightReferee"
    id = Column(Integer, primary_key=True)
    fight_id = Column(Integer, ForeignKey(Fight.id, ondelete="CASCADE"))
    referee_id = Column(Integer, ForeignKey(Referee.id, ondelete="CASCADE"))
    chief = Column(Boolean, default=False, nullable=False)


# Таблица счёта
# Здесь храним бой, игрока, его оценки, время их получения.
# По этим данным можно вычислить соответствующими выборками
# итоговый результат каждого матча
# ну и по завершении матча вычисляем победителей и записываем в FightWinner
class FightCounter(Base):
    __tablename__ = "FightCounter"
    id = Column(Integer, primary_key=True)
    fight_id = Column(Integer, ForeignKey(Fight.id, ondelete="CASCADE"))
    player = Column(
        Integer,
        ForeignKey(MatchParticipant.id, ondelete="CASCADE")
    )
    player_score = Column(String, nullable=False)
    set_datetime = Column(TIMESTAMP, nullable=False)


# Победитель боя
class FightWinner(Base):
    __tablename__ = "FightWinner"
    id = Column(Integer, primary_key=True)
    fight_id = Column(Integer, ForeignKey(Fight.id, ondelete="CASCADE"))
    winner_score = Column(Integer, nullable=False)
    loser_score = Column(Integer, nullable=False)


# -----------------------------------------------------------------------------


# Результаты матча
# Сюда записываем победителя именно матча уже на основе результатов всех боёв.
# Практически это как бы не особо нужно, их можно вычислить всегда.
# Но делаем это как раз для того, чтобы это были статичные данные,
# а не вычислять каждый раз при необходимости их получить.
# Записываем первое место, второе, третье.
class MatchResult(Base):
    __tablename__ = "MatchResult"
    id = Column(Integer, primary_key=True)
    match_id = Column(Integer, ForeignKey(Match.id, ondelete="CASCADE"))
    p1_id = Column(
        Integer,
        ForeignKey(MatchParticipant.id, ondelete="CASCADE")
    )
    p2_id = Column(
        Integer,
        ForeignKey(MatchParticipant.id, ondelete="CASCADE")
    )
    p3_id = Column(
        Integer,
        ForeignKey(MatchParticipant.id, ondelete="CASCADE")
    )
    p1_score = Column(String, nullable=False)
    p2_score = Column(String, nullable=False)
    p3_score = Column(String, nullable=False)


# Призы
class Prize(Base):
    __tablename__ = "Prize"
    id = Column(Integer, primary_key=True)
    match_id = Column(Integer, ForeignKey(Match.id, ondelete="CASCADE"))
    amount = Column(Integer, nullable=False)
    name = Column(String, nullable=False)
    description = Column(String, nullable=False)


# Медали
class Medal(Base):
    __tablename__ = "Medal"
    id = Column(Integer, primary_key=True)
    match_id = Column(Integer, ForeignKey(Match.id, ondelete="CASCADE"))
    recipient_id = Column(
        Integer,
        ForeignKey(MatchParticipant.id, ondelete="CASCADE")
    )
    medal_type = Column(String, nullable=False)


# Владельцы наград
class WinnerTable(Base):
    __tablename__ = "WinnerTable"
    id = Column(Integer, primary_key=True)
    match_id = Column(Integer, ForeignKey(Match.id, ondelete="CASCADE"))
    winner_id = Column(
        Integer,
        ForeignKey(MatchParticipant.id, ondelete="CASCADE")
    )
    winner_score = Column(String, nullable=False)
    medal = Column(
        Integer,
        ForeignKey(Medal.id, ondelete="CASCADE"),
        nullable=True
    )
    prize = Column(
        Integer,
        ForeignKey(Prize.id, ondelete="CASCADE"),
        nullable=True
    )
