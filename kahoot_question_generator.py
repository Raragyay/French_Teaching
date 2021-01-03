import copy
import random
from typing import Dict, List

import pandas as pd

from constants import DEFAULT_QUESTION
from question_generators import SectionPromptGenerator
from question_generators.english_to_french_generator import EnglishToFrenchGenerator
from question_generators.french_antonym_generator import FrenchAntonymGenerator
from question_generators.french_synonym_generator import FrenchSynonymGenerator
from question_generators.french_to_english_generator import FrenchToEnglishGenerator
from question_generators.question import Question
from question_generators.question_generator_base import QuestionGeneratorBase


class KahootQuestionGenerator:
    question_generators: Dict[str, QuestionGeneratorBase] = {
        'en-fr'         : EnglishToFrenchGenerator(),
        'fr-en'         : FrenchToEnglishGenerator(),
        'fr_syn'        : FrenchSynonymGenerator(),
        'fr_ant'        : FrenchAntonymGenerator(),
        'section_prompt': SectionPromptGenerator()
    }

    def __init__(self, dataframe: pd.DataFrame):
        self.df = dataframe

    def generate_questions(self,
                           question_type: str,
                           categories: List[str],
                           num_of_questions: int,
                           **kwargs):
        """
            question_type: one of "vocab", "section"
            num_of_questions: int > 0: how many questions are you making?
            options for kwargs:
                unique_answers: one of 2,3,4 -> how many answers are there for the question?
                unique_questions: bool -> is the term used unique for each question?
                duration: int > 0 -> how much time is given for the question, in milliseconds
                points: bool -> is the question worth points?
                pointsMultiplier: one of 1,2 -> point multiplier (base 1000)
        """
        if not categories:
            raise ValueError("Please specify at least one category from which to pick vocabulary.")
        filtered_df = self.df[self.df['Category'].isin(categories)]
        question_generator_obj = self.question_generators[question_type]
        question_generator = question_generator_obj.generate_n_questions(filtered_df, num_of_questions, **kwargs)
        return [KahootQuestionGenerator.create_question(question, **kwargs)
                for question in question_generator]

    @staticmethod
    def create_question(question: Question, **kwargs):
        question_template = copy.deepcopy(DEFAULT_QUESTION)
        question_template['question'] = question.prompt
        answer_array = [{
            'answer' : answer,
            'correct': answer in question.correct_answers}
            for answer in question.all_answers()]
        random.shuffle(answer_array)
        question_template['choices'] = answer_array
        for option in ['time', 'points', 'pointsMultiplier']:
            if option in kwargs:
                question_template[option] = kwargs[option]
        return question_template
