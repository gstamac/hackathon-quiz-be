import { IsBoolean, IsOptional, IsString, IsUUID } from 'class-validator'

export class CreateParticipantAnswerDto {
  @IsUUID('4')
  public question_id: string

  @IsUUID('4')
  public answer_id: string

  @IsString()
  public participant: string
}

export class CreateAnswerDto {
  @IsString()
  public answer: string

  @IsBoolean()
  @IsOptional()
  public is_correct?: boolean
}

export class CreateQuestionDto {
  @IsString()
  public question: string

  public answers: CreateAnswerDto[]
}

export class CreateGameDto {
  @IsString()
  public name: string

  public questions: CreateQuestionDto[]
}
