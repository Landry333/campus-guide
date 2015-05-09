package ca.josephroque.uottawacampusguide.activity;

import android.content.Intent;
import android.support.v7.app.ActionBarActivity;
import android.os.Bundle;
import android.view.Menu;
import android.view.MenuItem;

import ca.josephroque.uottawacampusguide.Constants;
import ca.josephroque.uottawacampusguide.R;
import ca.josephroque.uottawacampusguide.fragment.LanguageFragment;


public class IntroActivity extends ActionBarActivity
    implements LanguageFragment.OnLanguageSelectListener
{

    @Override
    protected void onCreate(Bundle savedInstanceState)
    {
        super.onCreate(savedInstanceState);

        boolean languageSelected = getSharedPreferences(Constants.PREFERENCES, MODE_PRIVATE).getBoolean(Constants.PREF_LANG, false);
        if (languageSelected)
        {
            Intent mainMenuIntent = new Intent(this, MainActivity.class);
            startActivity(mainMenuIntent);
            finish();
        }

        setContentView(R.layout.activity_intro);
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu)
    {
        // Inflate the menu; this adds items to the action bar if it is present.
        getMenuInflater().inflate(R.menu.menu_intro, menu);
        return true;
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item)
    {
        // Handle action bar item clicks here. The action bar will
        // automatically handle clicks on the Home/Up button, so long
        // as you specify a parent activity in AndroidManifest.xml.
        int id = item.getItemId();

        //noinspection SimplifiableIfStatement
        if (id == R.id.action_settings)
        {
            return true;
        }

        return super.onOptionsItemSelected(item);
    }

    @Override
    protected void onResume()
    {
        super.onResume();

        getFragmentManager().beginTransaction()
                .replace(R.id.fl_intro_container, LanguageFragment.newInstance())
                .commit();
    }

    @Override
    public void onLanguageSelected(boolean isEnglish)
    {
        getSharedPreferences(Constants.PREFERENCES, MODE_PRIVATE)
                .edit()
                .putBoolean(Constants.PREF_LANG, isEnglish)
                .apply();

    }
}
