import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Settings, User, ArrowLeft, ArrowRight } from 'lucide-react';
import './Lesson.css';
import './LessonPage.css';
import { progressAPI } from '../services/api';

const Lesson = () => {
  const { topic, lessonNumber } = useParams();
  const navigate = useNavigate();
  const lessonNum = parseInt(lessonNumber, 10);
  const [isCompleting, setIsCompleting] = useState(false);
  const [lessonStatus, setLessonStatus] = useState(null);
  const [isCheckingAccess, setIsCheckingAccess] = useState(true);

  // Прокрутка вверх при изменении урока
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [lessonNumber]);

  // Проверка доступности урока
  useEffect(() => {
    const checkLessonAccess = async () => {
      try {
        const res = await progressAPI.getByTopic(topic);
        const items = res.data?.items || [];
        const statusMap = {};
        for (const item of items) {
          statusMap[item.lesson_number] = item.status;
        }

        // Первый урок всегда доступен
        if (lessonNum === 1) {
          setLessonStatus('active');
          setIsCheckingAccess(false);
          return;
        }

        // Проверяем статус текущего урока
        const currentStatus = statusMap[lessonNum];
        if (!currentStatus || currentStatus === 'locked') {
          // Урок заблокирован - перенаправляем на список уроков
          navigate(`/topic/${topic}`);
          setIsCheckingAccess(false);
          return;
        }

        // Проверяем, что предыдущий урок пройден
        const previousStatus = statusMap[lessonNum - 1];
        if (previousStatus !== 'completed' && lessonNum > 1) {
          // Предыдущий урок не пройден - перенаправляем на список уроков
          navigate(`/topic/${topic}`);
          setIsCheckingAccess(false);
          return;
        }

        setLessonStatus(currentStatus);
        setIsCheckingAccess(false);
      } catch (error) {
        console.error('Ошибка проверки доступа к уроку:', error);
        // Если ошибка и это не первый урок, перенаправляем
        if (lessonNum !== 1) {
          navigate(`/topic/${topic}`);
        } else {
          setLessonStatus('active');
        }
        setIsCheckingAccess(false);
      }
    };

    checkLessonAccess();
  }, [topic, lessonNum, navigate]);

  // Обработка завершения урока
  const handleCompleteLesson = async (nextAction = 'next') => {
    setIsCompleting(true);
    try {
      // Отмечаем урок как пройденный
      await progressAPI.markCompleted(topic, lessonNum);
      
      if (nextAction === 'next') {
        // Переход на следующий урок с прокруткой вверх
        navigate(`/topic/${topic}/lesson/${lessonNum + 1}`);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        // Переход к списку уроков
        navigate(`/topic/${topic}`);
      }
    } catch (error) {
      console.error('Ошибка сохранения прогресса:', error);
      // Все равно переходим, даже если сохранение не удалось
      if (nextAction === 'next') {
        navigate(`/topic/${topic}/lesson/${lessonNum + 1}`);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        navigate(`/topic/${topic}`);
      }
    } finally {
      setIsCompleting(false);
    }
  };

  // Получаем контент урока
  const getLessonContent = () => {
    if (topic === 'rent' && lessonNum === 1) {
      return getRentLesson1Content();
    }
    if (topic === 'rent' && lessonNum === 2) {
      return getRentLesson2Content();
    }
    return <div>Урок находится в разработке</div>;
  };

  // Проверяем, есть ли следующий урок
  const hasNextLesson = () => {
    // Для темы rent есть как минимум 2 урока
    if (topic === 'rent' && lessonNum < 11) {
      return true;
    }
    return false;
  };

  return (
    <div className="lesson-page">
      <div className="lesson-page-container">
        {/* Шапка */}
        <div className="lesson-page-header">
          <div className="lesson-page-header-content">
            <div className="header-logo">ЛОГОТИП</div>
            <nav className="header-nav">
              <Link to="/dashboard" className="header-nav-link">Задания</Link>
              <Link to="/shop" className="header-nav-link">Магазин</Link>
            </nav>
            <div className="header-social-links">
              <Link to="/settings" className="header-social-icon">
                <Settings size={32} color="#000000" />
              </Link>
              <Link to="/profile" className="header-social-icon">
                <User size={32} color="#000000" />
              </Link>
            </div>
          </div>
        </div>

        {/* Кнопка назад */}
        <div className="lesson-page-back">
          <button 
            onClick={() => navigate(`/topic/${topic}`)}
            className="back-button"
          >
            <ArrowLeft size={20} />
            <span>Назад к урокам</span>
          </button>
        </div>

        {/* Основной контент */}
        <div className="lesson-content">
          {isCheckingAccess ? (
            <div style={{ padding: '100px 20px', textAlign: 'center' }}>
              Загрузка...
            </div>
          ) : (
            <>
              {getLessonContent()}
              
              {/* Кнопки навигации */}
              <div className="lesson-navigation">
            {hasNextLesson() && (
              <button
                onClick={() => handleCompleteLesson('next')}
                disabled={isCompleting}
                className="lesson-button lesson-button-primary"
              >
                <span>Следующий урок</span>
                <ArrowRight size={20} />
              </button>
            )}
            <button
              onClick={() => handleCompleteLesson('topics')}
              disabled={isCompleting}
              className="lesson-button lesson-button-secondary"
            >
              <span>К списку уроков</span>
            </button>
              </div>
            </>
          )}
        </div>

        {/* Футер */}
        <div className="lesson-page-footer">
          <div className="lesson-page-footer-content">
            <div className="footer-logo">ЛОГОТИП</div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Контент первого урока по съему квартиры
const getRentLesson1Content = () => {
  return (
    <>
      <h1>Поиск жилища</h1>
      
      <p>
        Поиск жилья — одно из первых серьёзных решений во взрослой жизни. От того, насколько внимательно вы подойдёте к выбору квартиры и заключению договора, зависит не только ваш комфорт, но и безопасность. Мошенники, скрытые условия и устные обещания — частые ловушки для тех, кто снимает жильё впервые.
      </p>

      <p>
        Ниже представлены общие правила и советы, тот самый базовый минимум, что нужно сделать перед подписание договора об аренде.
      </p>

      <h2>1. Подготовка и поиск</h2>
      
      <ul>
        <li>Определите бюджет аренды — не более 30% дохода.</li>
        <li>Сразу решите, какие условия важны: район, транспорт, наличие мебели, техника, интернет.</li>
        <li>Проверяйте агрегаторы с проверенными объявлениями: <a href="https://www.cian.ru" target="_blank" rel="noopener noreferrer">Циан</a>, <a href="https://www.avito.ru" target="_blank" rel="noopener noreferrer">Авито</a>, <a href="https://realty.yandex.ru" target="_blank" rel="noopener noreferrer">Яндекс.Недвижимость</a>.</li>
        <li>Осторожно относитесь к объявлениям с подозрительно низкой ценой или без фото реальной квартиры — вероятен фейк или мошенник.</li>
      </ul>

      <h2>2. Связь с арендодателем</h2>
      
      <ul>
        <li>Задавайте вопросы заранее: кто собственник, есть ли посредник, входит ли коммуналка.</li>
        <li>Не переводите деньги до осмотра.</li>
        <li>Запрашивайте паспортные данные владельца и документы на квартиру (выписка из ЕГРН).</li>
      </ul>

      <h2>3. Осмотр квартиры</h2>
      
      <p>Проверяйте всё своими руками:</p>
      
      <ol>
        <li>Водопровод, кран, сантехника, свет, розетки.</li>
        <li>Окна, двери, замки, вентиляция.</li>
        <li>Плиту, холодильник, стиралку.</li>
      </ol>

      <ul>
        <li>Обратите внимание на соседей, запахи, шум, состояние подъезда.</li>
        <li>Составьте чек-лист осмотра, чтобы ничего не забыть.</li>
      </ul>

      <h2>4. Проверка документов</h2>
      
      <ul>
        <li>Убедитесь, что договор подписывает именно собственник, а не «знакомый».</li>
        <li>Проверьте выписку из Росреестра (ЕГРН) — можно заказать онлайн.</li>
        <li>Если сдаёт по доверенности — проверьте срок действия и нотариальное заверение.</li>
      </ul>

      <h2>5. Договор аренды</h2>
      
      <p>Подписывайте договор найма (если физлицо) или аренды (если юрлицо).</p>
      
      <p>Важно указать:</p>
      
      <ol>
        <li>срок и стоимость аренды;</li>
        <li>кто оплачивает коммунальные услуги;</li>
        <li>условия возврата залога;</li>
        <li>порядок досрочного расторжения;</li>
        <li>ответственность сторон.</li>
      </ol>

      <p>Составьте акт приёма-передачи: зафиксируйте состояние квартиры, мебели и техники, показания счётчиков.</p>

      <h2>6. Финансовые вопросы</h2>
      
      <ul>
        <li>Обычно требуется залог = 1 месяц аренды, возвращается при съезде, если нет повреждений.</li>
        <li>Не отдавайте деньги без подписанного договора и акта.</li>
        <li>Если есть агент — оплачивайте услуги после подписания договора.</li>
      </ul>

      <h2>7. Безопасность и мошенники</h2>
      
      <ul>
        <li>Никогда не переводите предоплату за «бронирование» или «показ» квартиры.</li>
        <li>Не подписывайте договор с неизвестными посредниками.</li>
        <li>Проверяйте ФИО арендодателя, адрес и реквизиты.</li>
      </ul>

      <h2>8. При съезде</h2>
      
      <ul>
        <li>Сделайте новый акт возврата квартиры с фиксированием состояния и счётчиков.</li>
        <li>Только после этого передавайте ключи и получайте возврат залога.</li>
      </ul>
    </>
  );
};

// Контент второго урока по съему квартиры
const getRentLesson2Content = () => {
  return (
    <>
      <h1>Вопрос – копейку бережет</h1>
      
      <p>
        Вопросы, которые нужно задать арендодателю
      </p>

      <h2>1. Вопросы про саму квартиру</h2>
      
      <ul>
        <li>Сколько лет сдаётся квартира? — понять, не «тестовая» ли это сдача.</li>
        <li>Можно ли проживать с детьми / животными?</li>
        <li>Что входит в квартиру? — мебель, техника, посуда, интернет.</li>
        <li>Работает ли техника? — проверить плиту, стиралку, холодильник.</li>
        <li>Кто платит за мелкий ремонт, если что-то сломается?</li>
        <li>Можно ли делать перестановку или вешать полки/картины?</li>
        <li>Кто ваши соседи? — узнать об окружении и шуме.</li>
      </ul>

      <h2>2. Вопросы про оплату и залог</h2>
      
      <ul>
        <li>Какая стоимость аренды и входит ли в неё коммуналка?</li>
        <li>Кто оплачивает счётчики (свет, вода, газ, интернет)?</li>
        <li>Есть ли залог (депозит)? Как и когда он возвращается?</li>
        <li>Принимаете ли оплату по безналу или только наличными?</li>
        <li>Когда нужно вносить оплату — до или после месяца проживания?</li>
      </ul>

      <h2>3. Вопросы про документы и юридическую чистоту</h2>
      
      <ul>
        <li>Квартира ваша? Можно увидеть документ, подтверждающий собственность (ЕГРН, свидетельство)?</li>
        <li>Если сдаёте по доверенности — можно посмотреть доверенность?</li>
        <li>Договор будет оформлен официально?</li>
        <li>Можно ли включить пункт о возврате залога и срок расторжения?</li>
        <li>Будет ли составлен акт приёма-передачи квартиры и имущества?</li>
      </ul>

      <h2>4. Вопросы про сроки и условия проживания</h2>
      
      <ul>
        <li>На какой срок вы готовы заключить договор?</li>
        <li>Можно ли продлить договор после окончания срока?</li>
        <li>Как нужно уведомить вас, если я захочу съехать раньше?</li>
        <li>Как часто вы планируете приезжать в квартиру? (по закону — только по договорённости).</li>
        <li>Сколько комплектов ключей вы дадите?</li>
      </ul>

      <h2>5. Вопросы, которые помогут выявить мошенников</h2>
      
      <ul>
        <li>Можно ли посмотреть квартиру лично, прежде чем вносить оплату?</li>
        <li>Почему такая низкая цена (если ниже рыночной)?</li>
        <li>Почему торопите с решением?</li>
        <li>Вы собственник или агент?</li>
        <li>Можно ли записать номер вашего паспорта в договоре?</li>
      </ul>
    </>
  );
};

export default Lesson;

