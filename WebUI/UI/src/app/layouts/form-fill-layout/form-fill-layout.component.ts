import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Question } from '@datas/models/base/question';
import { FormService } from '@datas/services/base/form/form.service';
import { QuestionSortService } from '@shared/services/question-sort/question-sort.service';
import { LocalStorageService } from '@shared/services/local-storage/local-storage.service';
import { QuestionTypesValidationService } from '@shared/services/validations/question-types-validation/question-types-validation.service';
import { Router } from '@angular/router';
import { QuestionSettingsService } from '@shared/services/question-settings/question-settings.service';
import { Form } from '@datas/models/base/form';
import { UserDto } from '@datas/models/dto/user-dto';
import { PrevNextService } from '@shared/services/prev-next/prev-next.service';

@Component({
  selector: 'app-form-fill-layout',
  templateUrl: './form-fill-layout.component.html',
  styleUrls: ['./form-fill-layout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormFillLayoutComponent implements OnInit {
  form: Form;
  user: UserDto;
  filledQuestion: Question;
  prevQuestionSettings: any;
  nextQuestionSettings: any;
  filledQuestionSettings;

  questions: Question[];
  questionNumber;
  questionOrder;
  progressPercentage;
  questionSettings: any[];
  dataLoaded: boolean = false;
  public isCompleted: boolean = false;
  responses: any = [];
  requiredQuestions: any = [];

  constructor(
    private formService: FormService,
    private questionSortService: QuestionSortService,
    private localStorageService: LocalStorageService,
    private router: Router,
    private questionSettingsService: QuestionSettingsService,
    public prevNextService: PrevNextService,
    public questionTypesValidationService: QuestionTypesValidationService
  ) {
    this.questionSettingsService.setAction('fill');
    let formId = this.getFormId();
    this.user = localStorageService.getUser();
    this.getForm(formId);
  }

  ngOnInit(): void {
    this.localStorageService.setResponses(this.responses);
    this.localStorageService.setRequiredQuestions(this.requiredQuestions);
  }


  

  getFormId() {
    let formUrl = this.router.url;
    var temp = formUrl.split('form', 2);
    var formId = Number(temp[1].split('/', 2)[1]);

    return formId;
  }

  getForm(formId) {
    this.formService.getById(formId).subscribe((response) => {
      let form = response.data;
      form.questions = this.questionSortService.sort(form.questions);
      this.questionNumber = form.questions.length;
      this.localStorageService.setFilledForm(form);
      this.filledQuestion = form.questions[0];

      this.setFilledQuestion(this.filledQuestion);
      this.questionSettingsService.setQuestionSettings(
        this.filledQuestion,
        this.localStorageService.setFilledQuestionSettings
      );

      if (this.getQuestions().length >= 1) {
        this.nextQuestionSettings = form.questions[1];

        this.questionSettingsService.setQuestionSettings(
          this.nextQuestionSettings,
          this.localStorageService.setNextQuestionSettings
        );
      }

      this.dataLoaded = true;
    });
  }
  

  isQuestionNumber(number: number) {
    return this.getQuestions.length == number;
  }

  getFilledQuestion() {
    return this.localStorageService.getFilledQuestion();
  }

  getFilledQuestionSettings() {
    return this.localStorageService.getFilledQuestionSettings();
  }

  setFilledQuestionSettings(filledQuestionSettings) {
    this.localStorageService.setFilledQuestionSettings(filledQuestionSettings);
  }

  setFilledQuestion(filledQuestion: Question) {
    if (this.getQuestions().length != 0) {
      filledQuestion = this.getQuestions()[0];
    } else {
      filledQuestion = new Question(0, 0, '', '', 0);
    }

    this.localStorageService.setFilledQuestion(filledQuestion);
  }

  getQuestions() {
    return this.localStorageService.getFilledForm().questions;
  }

  isSubmit() {
    return this.localStorageService.getFormAction() == 'submit';
  }

  getIsCompleted() {
    let isThere = false;
    for (let i = 0; i < this.localStorageService.getFormUsers().length; i++) {
      if (
        this.localStorageService.getFormUsers()[i].formId ==
        this.localStorageService.getFilledForm().id
      ) {
        if (
          this.localStorageService.getFormUsers()[i].userId ==
          this.localStorageService.getUser().id
        ) {
          isThere = true;
        }
      }
    }

    return isThere;
  }

  goToWorkspace() {
    this.router.navigate(['workspace']);
  }
}
