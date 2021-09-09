import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { fetchApiCurrencies, formEditExpense } from '../actions';

const paymentMethods = ['Dinheiro', 'Cartão de crédito', 'Cartão de débito'];
const tags = ['Alimentação', 'Lazer', 'Trabalho', 'Transporte', 'Saúde'];

class EditExpense extends React.Component {
  constructor(props) {
    super(props);
    const { expenseInEdition } = this.props;
    this.state = {
      id: expenseInEdition.id,
      value: expenseInEdition.value,
      currency: expenseInEdition.currency,
      tag: expenseInEdition.tag,
      method: expenseInEdition.method,
      description: expenseInEdition.description,
      // eslint-disable-next-line react/no-unused-state
      // exchangeRates: expenseInEdition.exchangeRates,
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
    const { dispatchFormEdit, expenses } = this.props;
    const newArrayExpenses = expenses.splice(id, 0, this.state);
    dispatchFormEdit(newArrayExpenses);
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
          name="method"
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
          name="description"
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
          name="currency"
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
              name="value"
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
  currencies: PropTypes.array.isRequired,
}.isRequired;

const mapStateToProps = (stateStore) => ({
  currencies: stateStore.wallet.currencies,
  expenses: stateStore.wallet.expenses,
  expenseInEdition: stateStore.wallet.expenseInEdition,
});

const mapDispatchToProps = (dispatch) => ({
  dispatchCurrencies: () => dispatch(fetchApiCurrencies()),
  dispatchFormEdit: (newArrayExpenses) => dispatch(formEditExpense(newArrayExpenses)),
});

export default connect(mapStateToProps, mapDispatchToProps)(EditExpense);
