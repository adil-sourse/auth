import { useNavigate } from "react-router-dom";
import Header from "../components/Header";

export default function Main() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col min-h-screen relative">
      <div className="absolute w-full">
        <Header transparent />
      </div>

      <section className="relative h-96 sm:h-screen w-full">
        <img
          src="https://picsum.photos/1920/1080?about"
          alt="About us background"
          className="absolute inset-0 w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
            <div className="text-center text-white">
              <h1 className="text-4xl font-bold mb-4">Добро пожаловать</h1>
              <p className="text-lg mb-6 ">
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Voluptatum, aliquam.
              </p>
              <button
                className="bg-white text-black px-6 py-3 rounded-lg font-medium hover:bg-gray-200"
                onClick={() => navigate("/products")}
              >
                Каталог
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-900 mb-8">
            Наша история
          </h2>
          <div className="flex flex-col md:flex-row gap-8 items-center">
            <div className="md:w-1/2">
              <p className="text-gray-600 text-base sm:text-lg leading-relaxed">
                Основанная в 2020 году, наша компания начала с небольшой команды
                энтузиастов, стремящихся сделать онлайн-шопинг простым и
                приятным. Сегодня мы предлагаем широкий ассортимент товаров — от
                электроники до одежды, с доставкой по всему миру.
              </p>
              <p className="text-gray-600 text-base sm:text-lg leading-relaxed mt-4">
                Мы верим в качество, доступность и отличный сервис. Наша цель —
                помочь каждому найти то, что ему нужно, по лучшей цене.
              </p>
            </div>
            <div className="md:w-1/2">
              <img
                src="https://picsum.photos/600/400?story"
                alt="Our story"
                className="w-full h-64 sm:h-80 object-cover rounded-lg shadow-md"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-20 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-900 mb-8">
            Наша миссия
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Качество
              </h3>
              <p className="text-gray-600">
                Мы тщательно отбираем товары, чтобы вы получали только лучшее.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Доступность
              </h3>
              <p className="text-gray-600">
                Доступные цены и акции для каждого покупателя.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Сервис
              </h3>
              <p className="text-gray-600">
                Быстрая доставка и поддержка 24/7.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-900 mb-8">
            Наша команда
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: "Фазилов Адиль",
                role: "Генеральный директор",
                img: "https://picsum.photos/200",
              },
              {
                name: "Фазилов Адиль",
                role: "Технический директор",
                img: "https://picsum.photos/220",
              },
              {
                name: "Фазилов Адиль",
                role: "Менеджер по продажам",
                img: "https://picsum.photos/230",
              },
            ].map((member) => (
              <div key={member.name} className="text-center">
                <img
                  src={member.img}
                  alt={member.name}
                  className="w-32 h-32 sm:w-40 sm:h-40 rounded-full mx-auto object-cover"
                  loading="lazy"
                />
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mt-4">
                  {member.name}
                </h3>
                <p className="text-gray-600">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-20 bg-black text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-8">
            Свяжитесь с нами
          </h2>
          <p className="text-base sm:text-lg max-w-2xl mx-auto mb-6">
            Есть вопросы? Напишите нам или позвоните — мы всегда на связи!
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-8">
            <div className="flex gap-1">
              <div className="">Почта:</div>
              <div className="underline">example@mail.com</div>
            </div>
            <div className="flex gap-1">
              <div className="">Телефон:</div>
              <div className="underline">+7 (777) 777-77-77</div>
            </div>
          </div>
          <button className="mt-8 bg-white text-black hover:bg-gray-200 px-3 py-1 rounded-lg">
            Написать нам
          </button>
        </div>
      </section>

      <footer className="bg-black text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between">
          <div>
            <h3 className="text-lg font-bold">Контакты</h3>
            <p className="mt-2">Почта: example@mail.com</p>
            <p>Телефон: +7 (777) 777-77-77</p>
          </div>
          <div>
            <h3 className="text-lg font-bold">Ссылки</h3>
            <div className="mt-2">
              <div className="hover:underline cursor-pointer">О нас</div>

              <div className="hover:underline cursor-pointer">Контакты</div>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-bold">Присоединиться</h3>
            <div className="flex gap-4 mt-2">
              <span>
                <img src="" alt="" />
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
