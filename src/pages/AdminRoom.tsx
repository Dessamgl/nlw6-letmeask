import { useHistory, useParams } from 'react-router-dom';

import logoImg from '../assets/images/logo.svg';
import deleteImg from '../assets/images/delete.svg';
import checkImg from '../assets/images/check.svg';
import answerImg from '../assets/images/answer.svg';

import { Button } from '../components/Button';
import { Question } from '../components/Question';
import { RoomConde } from '../components/RoomCode';
// import { useAuth } from '../hooks/useAuth';
import { database } from '../services/firebase';
import { useRoom } from '../hooks/useRoom';

import '../styles/room.scss';

type RoomParams = {
  id: string;
}

export function AdminRoom() {
  // const {user} = useAuth();
  const history = useHistory();
  const params = useParams<RoomParams>();
  const roomID = params.id;
  const {title, questions } = useRoom(roomID);

  async function handleEndRoom() {
    await database.ref(`rooms/${roomID}`).update({
      endedAt: new Date(),
    })

    history.push('/')
  }

  async function handleDeleteQuestion(questionId: string) {
    if(window.confirm("Tem certeza que deseja excluir essa pergunta ?")) {
      await database.ref(`rooms/${roomID}/questions/${questionId}`).remove();
    }
  }

  async function handleCheckQuestionAsAnswered(questionId: string) {
    await database.ref(`rooms/${roomID}/questions/${questionId}`).update({
      isAnswered: true
    });
  }

  async function handleHighlightQuestion(questionId: string) {
    await database.ref(`rooms/${roomID}/questions/${questionId}`).update({
      isHighLighted: true
    });
  }

  return (
    <div id="page-room">
      <header>
        <div className="content">
          <img src={logoImg} alt="" />
          <div>
            <RoomConde code={roomID}/>
            <Button isOutlined onClick={handleEndRoom}>Encerrar sala</Button>
          </div>
        </div>
      </header>

      <main>
        <div className="room-title">
          <h1>Sala {title}</h1>
          {questions.length > 0 &&  <span>{questions.length} pergunta(s)</span>}
        </div>
          <div className="question-list">
            {questions.map(question => {
              return (
                <Question 
                  key={question.id}
                  content={question.content}
                  author={question.author}
                  isAnswered={question.isAnswered}
                  isHighLighted={question.isHighLighted}
                >
                  {!question.isAnswered && (
                    <>
                      <button
                        type="button"
                        onClick={() => handleCheckQuestionAsAnswered(question.id)}
                      >
                        <img src={checkImg} alt="Marcar pergunta respondida" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleHighlightQuestion(question.id)}
                      >
                        <img src={answerImg} alt="Dar destaque a pergunta" />
                      </button>
                  </>
                  )}
                  <button
                    type="button"
                    onClick={() => handleDeleteQuestion(question.id)}
                  >
                    <img src={deleteImg} alt="Remover pergunta" />
                  </button>
                </Question>
              );
            })}
          </div>
      </main>
    </div>
  )
}