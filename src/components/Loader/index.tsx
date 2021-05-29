import style from './Loader.module.scss';

const Loader = () => {
  return (
    <div className={style.loader__wrapper}>
      <div className={style.loader} />
    </div>
  );
};

export default Loader;
