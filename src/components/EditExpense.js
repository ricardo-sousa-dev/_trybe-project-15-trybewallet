import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router'; // importação para utilizar as informações do history da página inicial. Encapsular o componente no export.
import { fetchApiCurrencies, formEditExpense } from '../actions';

const paymentMethods = ['Dinheiro', 'Cartão de crédito', 'Cartão de débito'];
const tags = ['Alimentação', 'Lazer', 'Trabalho', 'Transporte', 'Saúde'];

class EditExpense extends React.Component {
  constructor(props) {
    super(props);
    const { expenseInEdition } = this.props;
    this.state = {
      value: expenseInEdition.value,
      currency: expenseInEdition.currency,
      method: expenseInEdition.method,
      tag: expenseInEdition.tag,
      description: expenseInEdition.description,
      id: expenseInEdition.id,
      exchangeRates: expenseInEdition.exchangeRates,
    };
    this.handleChange = this.handleChange.bind(this);
    this.onSubmitForm = this.onSubmitForm.bind(this);
  }

  componentDidMount() {
    const { dispatchCurrencies } = this.props;
    dispatchCurrencies();
  }

  onSubmitForm() {
    const { id } = this.state;
    const { dispatchFormEdit, expenses, history } = this.props;
    const newArrayExpense = expenses.filter((expense) => expense.id !== id);
    newArrayExpense.push(this.state);
    dispatchFormEdit(newArrayExpense);
    history.push('/carteira');
  }

  handleChange({ target: { name, value } }) {
    this.setState({
      [name]: value,
    });
  }

  methodInput() {
    const { method } = this.state;
    return (
      <label htmlFor="método de pagamento">
        Método de pagamento:
        <select
          id="método de pagamento"
          name="método de pagamento"
          onChange={ this.handleChange }
          className="form__field"
          value={ method }
        >
          { paymentMethods.map((meth) => (
            <option key={ meth }>{ meth }</option>)) }
        </select>
      </label>
    );
  }

  descriptionInput() {
    const { description } = this.state;
    return (
      <label htmlFor="descrição">
        Descrição:
        <input
          type="text"
          id="descrição"
          name="descrição"
          value={ description }
          onChange={ this.handleChange }
        />
      </label>
    );
  }

  currencyInput() {
    const { currency } = this.state;
    const { currencies } = this.props;
    return (
      <label htmlFor="moeda">
        Moeda:
        <select
          type="text"
          name="moeda"
          id="moeda"
          value={ currency }
          onChange={ this.handleChange }
        >
          { currencies
            .filter((index) => index !== 'USDT')
            .map((coin) => (<option key={ coin }>{ coin }</option>)) }
        </select>
      </label>
    );
  }

  render() {
    const { value, tag } = this.state;
    return (
      <div className="formEditExpense">
        <form>

          <label htmlFor="valor">
            Valor:
            <input
              className="inputValueForm"
              type="text"
              id="valor"
              name="valor"
              value={ value }
              onChange={ this.handleChange }
            />
          </label>

          { this.currencyInput() }
          { this.methodInput() }

          <label htmlFor="tag">
            Tag:
            <select
              onChange={ this.handleChange }
              id="tag"
              name="tag"
              value={ tag }
              className="form__field"
            >
              { tags.map((oneTag) => (<option key={ oneTag }>{ oneTag }</option>)) }
            </select>
          </label>
          { this.descriptionInput() }

          <button
            type="button"
            className="btn float-right despesa_btn"
            onClick={ this.onSubmitForm }
          >
            Editar despesa
          </button>

        </form>
      </div>
    );
  }
}

EditExpense.propTypes = {
  currencies: PropTypes.shape({
    filter: PropTypes.func,
  }).isRequired,
  dispatchCurrencies: PropTypes.func.isRequired,
  dispatchFormEdit: PropTypes.func.isRequired,
  expenseInEdition: PropTypes.shape({
    currency: PropTypes.string,
    description: PropTypes.string,
    exchangeRates: PropTypes.string,
    id: PropTypes.number,
    method: PropTypes.string,
    tag: PropTypes.string,
    value: PropTypes.number,
  }).isRequired,
  expenses: PropTypes.shape({
    filter: PropTypes.func,
  }).isRequired,
  history: PropTypes.shape({
    push: PropTypes.func,
  }).isRequired,
};

const mapStateToProps = (stateStore) => ({
  currencies: stateStore.wallet.currencies,
  expenses: stateStore.wallet.expenses,
  expenseInEdition: stateStore.wallet.expenseInEdition,
});

const mapDispatchToProps = (dispatch) => ({
  dispatchFormEdit: (newArrayExpense) => dispatch(formEditExpense(newArrayExpense)),
  dispatchCurrencies: () => dispatch(fetchApiCurrencies()),
});

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(EditExpense));
